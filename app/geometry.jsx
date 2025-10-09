import { useRef, useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { useFocusEffect } from '@react-navigation/native';
import getMainStyles from '../styles/main';
import useAccelerometer from '../modules/accelerometer';
import useGyroscope from '../modules/gyroscope';
import Navigation from '../components/navigation';

global.THREE = global.THREE || THREE;

const useThreeScene = (aRef, gRef) => {
  const cubeRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const threeRefs = useRef({ renderer: null, scene: null, camera: null });

  const rotationVelRef = useRef({ x: 0, y: 0, z: 0 });
  const DAMPING = 0.95;
  const ROLL_SENSITIVITY = 0.001;
  const SMOOTH_FACTOR = 0.1;

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
    camera.position.z = 5;

    //cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubeRef.current = cube;

    //border
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const line = new THREE.LineSegments(edges, lineMaterial);
    cube.add(line);

    threeRefs.current = { renderer, scene, camera };

    const renderLoop = () => {
      const { renderer, scene, camera } = threeRefs.current;
      const cube = cubeRef.current;
      const { x: ax, y: ay, z: az } = aRef.current;
      const { z: gz } = gRef.current;
      const rotVel = rotationVelRef.current;

      if (renderer && scene && camera) {

        const pitch = Math.atan2(ay, az);
        const roll = Math.atan2(-ax, Math.sqrt(ay * ay + az * az));

        cube.rotation.x += (pitch - cube.rotation.x) * SMOOTH_FACTOR;
        cube.rotation.y += (roll - cube.rotation.y) * SMOOTH_FACTOR;

        rotVel.z += gz * ROLL_SENSITIVITY;
        rotVel.z *= DAMPING;
        cube.rotation.z += rotVel.z;

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
        <Navigation active="geometry" />

        <GLView
          style={styles.glView}
          onContextCreate={onContextCreate}
        />

        <View style={styles.footer}>
          <SensorDataDisplay a={aRef.current} g={gRef.current} styles={styles} />
        </View>
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