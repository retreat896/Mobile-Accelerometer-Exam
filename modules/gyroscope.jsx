import { useState, useEffect } from 'react';
import { Gyroscope } from 'expo-sensors';

/**
 * 
 * @returns data, subscription, _subscribe(), _unsubscribe(), _slow(), _fast()
 */
export default function useGyroscope() {
    const [data, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState(null);

    const _slow = () => Gyroscope.setUpdateInterval(1000);
    const _fast = () => Gyroscope.setUpdateInterval(16);

    const _subscribe = () => {
		setSubscription(
			Gyroscope.addListener(gyroscopeData => {
				setData(gyroscopeData);
			})
		);
	};

	const _unsubscribe = () => {
		subscription && subscription.remove();
		setSubscription(null);
	};

    useEffect(() => {
		_subscribe();
		return () => _unsubscribe();
	}, []);

    return { data, subscription, _subscribe, _unsubscribe, _slow, _fast };
}