import { useRef, useEffect, useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { useFocusEffect } from '@react-navigation/native'; // Ensure correct package name

// Local Imports
import getMainStyles from '../styles/main';
import useAccelerometer from '../modules/accelerometer';
import useGyroscope from '../modules/gyroscope';
import Navigation from '../components/navigation';

global.THREE = global.THREE || THREE;


const useThreeScene = (accelerometerData, gyroscopeData) => {
  const cubeRef = useRef(null);
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
    camera.position.z = 2;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubeRef.current = cube;
    threeRefs.current = { renderer, scene, camera };

    const renderLoop = () => {
      const { renderer, scene, camera } = threeRefs.current;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
        gl.endFrameEXP();
      }
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();
  }, []);

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

  //update Cube
  useEffect(() => {
    if (cubeRef.current && accelerometerData) {
      const { x, y, z } = accelerometerData;
      const pitch = Math.atan2(y, z);
      const roll = Math.atan2(-x, Math.sqrt(y * y + z * z));

      cubeRef.current.rotation.x = pitch;
      cubeRef.current.rotation.y = roll;
      cubeRef.current.rotation.z = gyroscopeData.z * 0.01;
    }
  }, [accelerometerData, gyroscopeData]); //runs on accelerometerData change

  return onContextCreate;
};

const Geometry = () => {
  const styles = getMainStyles();
  const a = useAccelerometer();
  const g = useGyroscope();

  const onContextCreate = useThreeScene(a, g);

  return (
    <SafeAreaProvider style={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <Navigation active="geometry" />

        <GLView
          style={{ flex: 1 }}
          onContextCreate={onContextCreate}
        />

        <View style={styles.footer}>
          <SensorDataDisplay a={a} g={g} styles={styles} />
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