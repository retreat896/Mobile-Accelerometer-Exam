import { useState, useEffect } from 'react';
import { Gyroscope } from 'expo-sensors';

const FRAME_RATE = 90;
const FRAME_RATE_MS = 1000 / FRAME_RATE;

export default function useGyroscope() {
	const [data, setData] = useState({ x: 0, y: 0, z: 0 });


	useEffect(() => {
		const sub = Gyroscope.addListener(setData);
		Gyroscope.setUpdateInterval(FRAME_RATE_MS);

		return () => {
			sub && sub.remove();
		};
	}, []);

	return data;
}