import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import getMainStyles from '../styles/main';
import getButtonStyles from '../styles/button';
import useAccelerometer from '../modules/accelerometer';
import useGyroscope from '../modules/gyroscope';
import Navigation from '../components/navigation';
import { Renderer } from 'expo-three';
import { THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
global.THREE = global.THREE || THREE;

const Geometry = () => {
  const styles = getMainStyles();
  const button = getButtonStyles();
  const a = useAccelerometer();
  const g = useGyroscope();


  return (
    <SafeAreaProvider style={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <Navigation active="geometry" />
        <GLView
          style={{ flex: 1 }}
          onContextCreate={(ExpoWebGLRenderingContext) => {
            // Create a WebGLRenderer without a DOM element
            const renderer = new Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
          }}
        />
        <View style={styles.footer}>
          <Text style={[styles.text, styles.text.green]}>Accelerometer Data:</Text>
          <Text style={[styles.text, styles.text.green]}>x: {a.x.toFixed(2)}</Text>
          <Text style={[styles.text, styles.text.green]}>y: {a.y.toFixed(2)}</Text>
          <Text style={[styles.text, styles.text.green]}>z: {a.z.toFixed(2)}</Text>
          <Text style={[styles.text, styles.text.green]}>Gyroscope Data:</Text>
          <Text style={[styles.text, styles.text.green]}>x: {g.x.toFixed(2)}</Text>
          <Text style={[styles.text, styles.text.green]}>y: {g.y.toFixed(2)}</Text>
          <Text style={[styles.text, styles.text.green]}>z: {g.z.toFixed(2)}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Geometry;
