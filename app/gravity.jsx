import { useRef, useCallback, useState, useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, Dimensions, Button } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { useFocusEffect } from '@react-navigation/native';
import getMainStyles from '../styles/main';
import useAccelerometer from '../modules/accelerometer';
import useGyroscope from '../modules/gyroscope';
import Navigation from '../components/navigation';

global.THREE = global.THREE || THREE;


const useThreeScene = (aRef) => {

    const physicsRef = useRef({
        velocityX: 0,
        velocityY: 0,
        DAMPING: 0.95,
        ACCEL_SENSITIVITY: 0.1,
        ROLL_SENSITIVITY: 0.1,
    });

    const [size, changeSize] = useState(0.5);

    const ballRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const threeRefs = useRef({ renderer: null, scene: null, camera: null });
    const { width, height } = Dimensions.get('window');

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

        const geometry = new THREE.CircleGeometry(size, 100);
        const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
        const ball = new THREE.Mesh(geometry, material);
        scene.add(ball);

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 5 });
        const line = new THREE.LineSegments(edges, lineMaterial);
        ball.add(line);

        ballRef.current = ball;


        threeRefs.current = { renderer, scene, camera };

        const renderLoop = () => {
            const { renderer, scene, camera } = threeRefs.current;

            const ball = ballRef.current;
            const a = aRef.current;
            const p = physicsRef.current;
            const vFOV = 75 * (Math.PI / 180);
            const viewHeight = 2 * camera.position.z * Math.tan(vFOV / 2);
            const aspectRatio = width / height;
            const viewWidth = viewHeight * aspectRatio;
            const boundX = (viewWidth / 2) - .8;
            const boundY = (viewHeight / 2) - .5;

            if (renderer && scene && camera) {
                //velocity Update
                p.velocityX += -a.x * p.ACCEL_SENSITIVITY;
                p.velocityY += -a.y * p.ACCEL_SENSITIVITY;

                //damping
                p.velocityX *= p.DAMPING;
                p.velocityY *= p.DAMPING;

                //position Update
                ball.position.x += p.velocityX;
                ball.position.y += p.velocityY;

                //collisions (Boundary Check)
                ball.position.x = Math.max(Math.min(ball.position.x, boundX), -boundX);
                ball.position.y = Math.max(Math.min(ball.position.y, boundY), -boundY);

                //bounce off of walls
                if (ball.position.x === boundX || ball.position.x === -boundX) p.velocityX *= -0.5;
                if (ball.position.y === boundY || ball.position.y === -boundY) p.velocityY *= -0.5;

                renderer.render(scene, camera);
                gl.endFrameEXP();
            }
            animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        renderLoop();
    }, [aRef]);

    useEffect(() => {
        const { scene } = threeRefs.current;
        if (!scene || !ballRef.current) return;

        // Remove old ball
        scene.remove(ballRef.current);

        // Create new geometry with updated size
        const geometry = new THREE.CircleGeometry(size, 100);
        const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
        const newBall = new THREE.Mesh(geometry, material);

        scene.add(newBall);
        ballRef.current = newBall;
    }, [size]);


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

    return { onContextCreate, size, changeSize };
};

const Geometry = () => {
    const styles = getMainStyles();
    const aRef = useAccelerometer();
    const gRef = useGyroscope();

    const { onContextCreate, size, changeSize } = useThreeScene(aRef, gRef);

    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView style={styles.screen}>
                <Navigation active="gravity" />
                <GLView
                    style={styles.glView}
                    onContextCreate={onContextCreate}
                />
                <Button
                title={`Size: ${size}`}
                onPress={() =>{
                    if(size>=4){changeSize(0.5)}else{
                        changeSize(prev => prev + 0.5)
                    }
                    }
                }
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