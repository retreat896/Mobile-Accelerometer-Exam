import { useRef, useEffect } from 'react';
import { Gyroscope } from 'expo-sensors';

// Set your desired update rate
const FRAME_RATE = 60; // Use a higher rate like 60 FPS for smoother input
const FRAME_RATE_MS = 1000 / FRAME_RATE;

export default function useGyroscope() {
  const dataRef = useRef({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    const listener = (newData) => {
      dataRef.current = newData;
    };
    const sub = Gyroscope.addListener(listener);
    Gyroscope.setUpdateInterval(FRAME_RATE_MS);
    return () => {
      sub && sub.remove();
    };
  }, []);
  return dataRef;
}