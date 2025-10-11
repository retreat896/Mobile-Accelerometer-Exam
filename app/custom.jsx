import { useRef, useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useFocusEffect } from '@react-navigation/native';
import getMainStyles from '../styles/main';
import useAccelerometer from '../modules/accelerometer';
import Navigation from '../components/navigation';

global.THREE = global.THREE || THREE;

const useThreeScene = (aRef) => {
    const physicsRef = useRef({
        velocityX: 0,
        velocityY: 0,
        DAMPING: 0.95,
        ACCEL_SENSITIVITY: 0.1,
    });

    const dartRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const threeRefs = useRef({ renderer: null, scene: null, camera: null });
    const { width, height } = Dimensions.get('window');

    const onContextCreate = useCallback(async (gl) => {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // SVG path data for the dart
        const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg">
            <path d="M136.221,27.244c2.638-11.053-2.09-24.443-2.09-24.443s-10.62,4.008-13.2,7.827C120.282,8.1,118.6,2.5,118.6,2.5s-1.687,5.6-2.326,8.128C113.68,6.809,103.059,2.8,103.059,2.8s-5.4,13.572-2.09,24.443c1.2,3.947,8.523,12.351,13.345,20.451,1.73,20.64-.585,27.683-2.127,32.421v21.313c0,4.535,3.892,7.814,4.243,8.231l1.987,25.788.042-.535.041.535,1.987-25.788c.356-.417,4.673-3.7,4.673-8.231V80.467c0-.119-.005-.232-.009-.351h.009c-1.532-4.709-3.824-11.708-2.155-32.053,4.842-7.868,12.083-16.07,13.216-20.819Z" />
        </svg>`;

        const loader = new SVGLoader();
        const svgPaths = loader.parse(svgData).paths;
        
        // Create shape from SVG path
        const shapes = [];
        svgPaths.forEach(path => {
            const pathShapes = path.toShapes(true);
            shapes.push(...pathShapes);
        });

        const geometry = new THREE.ShapeGeometry(shapes[0]);
        geometry.center(); // Center the geometry

        const material = new THREE.MeshBasicMaterial({
            color: 0x444444, // Dark gray color
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        
        const dart = new THREE.Mesh(geometry, material);
        
        // Scale and rotate the dart appropriately
        dart.scale.set(0.005, -0.005, 0.005); // Scale down the SVG and flip vertically
        
        scene.add(dart);
        dartRef.current = dart;

        threeRefs.current = { renderer, scene, camera };

        const renderLoop = () => {
            const { renderer, scene, camera } = threeRefs.current;

            const dart = dartRef.current;
            const a = aRef.current;
            const p = physicsRef.current;
            const vFOV = 75 * (Math.PI / 180);
            const viewHeight = 2 * camera.position.z * Math.tan(vFOV / 2);
            const aspectRatio = width / height;
            const viewWidth = viewHeight * aspectRatio;
            const boundX = (viewWidth / 2) - 1;
            const boundY = (viewHeight / 2) - 1;

            if (renderer && scene && camera && dart) {
                // Update velocity based on accelerometer
                p.velocityX += -a.x * p.ACCEL_SENSITIVITY;
                p.velocityY += -a.y * p.ACCEL_SENSITIVITY;

                // Apply damping
                p.velocityX *= p.DAMPING;
                p.velocityY *= p.DAMPING;

                // Update position
                dart.position.x += p.velocityX;
                dart.position.y += p.velocityY;

                // Calculate rotation angle based on velocity direction
                const angle = Math.atan2(p.velocityY, p.velocityX);
                dart.rotation.z = angle + Math.PI / 2; // Add PI/2 to invert the direction

                // Boundary checks with bounce effect
                if (dart.position.x > boundX) {
                    dart.position.x = boundX;
                    p.velocityX *= -0.5;
                } else if (dart.position.x < -boundX) {
                    dart.position.x = -boundX;
                    p.velocityX *= -0.5;
                }

                if (dart.position.y > boundY) {
                    dart.position.y = boundY;
                    p.velocityY *= -0.5;
                } else if (dart.position.y < -boundY) {
                    dart.position.y = -boundY;
                    p.velocityY *= -0.5;
                }

                renderer.render(scene, camera);
                gl.endFrameEXP();
            }
            animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        renderLoop();
    }, [aRef]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                if (animationFrameIdRef.current) {
                    cancelAnimationFrame(animationFrameIdRef.current);
                    animationFrameIdRef.current = null;
                }
            };
        }, [])
    );

    return onContextCreate;
};

const Custom = () => {
    const styles = getMainStyles();
    const aRef = useAccelerometer();
    const onContextCreate = useThreeScene(aRef);

    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView style={styles.screen}>
                <Navigation active="custom" />
                <GLView
                    style={styles.glView}
                    onContextCreate={onContextCreate}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Custom;