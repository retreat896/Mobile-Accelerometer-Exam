/**
 * Skeleton Code Taken From https://docs.expo.dev/versions/latest/sdk/gyroscope/
 */
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import getMainStyles from '../styles/main';
import getButtonStyles from '../styles/button';
import LinkButton from '../components/linkButton';
import useGyroscope from '../modules/gyroscope';

const Gyro = () => {
	const { data: { x, y, z }, subscription, _subscribe, _unsubscribe, _slow, _fast } = useGyroscope();

	const styles = getMainStyles();
	const button = getButtonStyles();

	return (
		<SafeAreaProvider style={styles.screen}>
      		<SafeAreaView style={styles.screen}>
        		<LinkButton title="Geometry" link="/geometry" active="true" />
        		<LinkButton title="Home" link="/" />
        		<LinkButton title="Gravity" link="/gravity" />
        		<LinkButton title="Custom" link="/custom" />
        		<LinkButton title="Gyroscope" link="/gyroscope" />

				<View style={styles.container}>
					<View style={styles.footer}>
    		    	  <Text style={[styles.text,styles.text.green]}>Gyroscope Data:</Text>
	        		  <Text style={[styles.text,styles.text.green]}>x: {x}</Text>
	    	    	  <Text style={[styles.text,styles.text.green]}>y: {y}</Text>
    			      <Text style={[styles.text,styles.text.green]}>z: {z}</Text>
		    	    </View>

					<View style={styles.buttonContainer}>
						<TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
							<Text>{subscription ? 'On' : 'Off'}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
							<Text>Slow</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={_fast} style={styles.button}>
							<Text>Fast</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

export default Gyro;