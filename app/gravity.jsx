import { useRef, useEffect, useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { useFocusEffect } from '@react-navigation/native'; // Ensure correct package name

// Local Imports
import getMainStyles from '../styles/main';
import useAccelerometer from '../modules/accelerometer';
import useGyroscope from '../modules/gyroscope';
import Navigation from '../components/navigation';

global.THREE = global.THREE || THREE;


const useThreeScene = (aRef, gRef) => {
    const physicsRef = useRef({
        velocityX: 0,
        velocityY: 0,
        DAMPING: 0.95,
        ACCEL_SENSITIVITY: 0.1, // Reduced this from 1 to 0.1 for stability
        ROLL_SENSITIVITY: 0.1,
        boundX: 2.9,
        boundY: 6,
    });
    const sensorDataRef = useRef({ a: { x: 0, y: 0, z: 0 }, g: { x: 0, y: 0, z: 0 } });


    const { width, height } = Dimensions.get('window');
    const ballRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const threeRefs = useRef({ renderer: null, scene: null, camera: null });

    //Runs once
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
        camera.position.z = 10;

        const geometry = new THREE.CircleGeometry(0.5, 10);
        const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
        const ball = new THREE.Mesh(geometry, material);
        scene.add(ball);
        ballRef.current = ball;
        threeRefs.current = { renderer, scene, camera };

        const renderLoop = () => {
            const { renderer, scene, camera } = threeRefs.current;

            const ball = ballRef.current;
            const a = aRef.current;
            const g = gRef.current;
            const p = physicsRef.current;

            if (renderer && scene && camera) {
                // --- 1. Ball Movement Logic (Now inside the 60FPS loop) ---

                // Velocity Update
                p.velocityX += -a.x * p.ACCEL_SENSITIVITY;
                p.velocityY += -a.y * p.ACCEL_SENSITIVITY; // Note: Use -a.y or (a.y-1) depending on your required frame of reference

                // Damping
                p.velocityX *= p.DAMPING;
                p.velocityY *= p.DAMPING;

                // Position Update
                ball.position.x += p.velocityX;
                ball.position.y += p.velocityY;

                // // Rotation (Rolling)
                // // Note: Ensure gyroscopeData is being used here if desired
                // if (g) {
                //     ball.rotation.x += g.x * p.ROLL_SENSITIVITY;
                //     ball.rotation.y += g.y * p.ROLL_SENSITIVITY;
                //     ball.rotation.z += g.z * p.ROLL_SENSITIVITY;
                // }

                // Collisions (Boundary Check)
                ball.position.x = Math.max(Math.min(ball.position.x, p.boundX), -p.boundX);
                ball.position.y = Math.max(Math.min(ball.position.y, p.boundY), -p.boundY);

                // Optional: Bounce on collision
                if (ball.position.x === p.boundX || ball.position.x === -p.boundX) p.velocityX *= -0.5;
                if (ball.position.y === p.boundY || ball.position.y === -p.boundY) p.velocityY *= -0.5;


                // --- 2. Rendering ---
                renderer.render(scene, camera);
                gl.endFrameEXP();
            }
            animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        renderLoop();
    }, [aRef, gRef]);

    //Stops the loop when screen blurs
    useFocusEffect(
        useCallback(() => {
            return () => {
                //prevent loops stacking
                if (animationFrameIdRef.current) {
                    cancelAnimationFrame(animationFrameIdRef.current);
                    animationFrameIdRef.current = null;
                }
            };
        }, [])
    );

    return onContextCreate;
};

const Geometry = () => {
    const styles = getMainStyles();
    const aRef = useAccelerometer();
    const gRef = useGyroscope();

    const onContextCreate = useThreeScene(aRef, gRef);

    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView style={styles.screen}>
                <Navigation active="gravity" />
                <GLView
                    style={styles.glView}
                    onContextCreate={onContextCreate}
                />

                {/* <View style={styles.footer}>
                    <SensorDataDisplay a={a} g={g} styles={styles} />
                </View> */}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const SensorDataDisplay = ({ a, g, styles }) => (
    <>
        <Text style={[styles.text, styles.text.green, styles.bold]}>Accelerometer Data:</Text>
        <Text style={[styles.text, styles.text.green]}>x: {a.x.toFixed(2)}</Text>
        <Text style={[styles.text, styles.text.green]}>y: {a.y.toFixed(2)}</Text>
        <Text style={[styles.text, styles.text.green]}>z: {a.z.toFixed(2)}</Text>
        <Text style={[styles.text, styles.text.green, styles.bold]}>Gyroscope Data:</Text>
        <Text style={[styles.text, styles.text.green]}>x: {g.x.toFixed(2)}</Text>
        <Text style={[styles.text, styles.text.green]}>y: {g.y.toFixed(2)}</Text>
        <Text style={[styles.text, styles.text.green]}>z: {g.z.toFixed(2)}</Text>
    </>
);

export default Geometry;