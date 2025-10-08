import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

const FRAME_RATE = 90;
const FRAME_RATE_MS = 1000 / FRAME_RATE;

export default function useAccelerometer() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const sub = Accelerometer.addListener(setData);
    Accelerometer.setUpdateInterval(FRAME_RATE_MS);

    return () => {
      sub && sub.remove();
    };
  }, []);

  return data;
}
