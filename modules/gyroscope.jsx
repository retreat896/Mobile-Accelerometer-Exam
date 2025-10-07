import { useState, useEffect } from 'react';
import { Gyroscope } from 'expo-sensors';

/**
 * 
 * @returns data, subscription, _subscribe(), _unsubscribe(), _slow(), _fast()
 */
export default function useGyroscope() {
	const [data, setData] = useState({ x: 0, y: 0, z: 0 });


	useEffect(() => {
		const sub = Gyroscope.addListener(setData);
		Gyroscope.setUpdateInterval(100);

		return () => {
			sub && sub.remove();
		};
	}, []);

	return data;
}