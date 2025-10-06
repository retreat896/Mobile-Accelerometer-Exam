import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import getMainStyles from '../styles/main';
import getButtonStyles from '../styles/button';
import LinkButton from '../components/linkButton';
import useAccelerometer from '../modules/accelerometer';

const Geometry = () => {
  const styles = getMainStyles();
  const button = getButtonStyles();
  const { x, y, z } = useAccelerometer();
    console.log('Accelerometer:', x, y, z);

  return (
    <SafeAreaProvider style={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <LinkButton title="Geometry" link="/geometry" active="true" />
        <LinkButton title="Home" link="/" />
        <LinkButton title="Gravity" link="/gravity" />
        <LinkButton title="Custom" link="/custom" />

        <View style={styles.footer}>
          <Text style={[styles.text,styles.text.green]}>Accelerometer Data:</Text>
          <Text style={[styles.text,styles.text.green]}>x: {x}</Text>
          <Text style={[styles.text,styles.text.green]}>y: {y}</Text>
          <Text style={[styles.text,styles.text.green]}>z: {z}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Geometry;
