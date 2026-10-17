'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Smooth exponential-lag camera that gently follows mouse pointer.
 * Camera is parked at an angle (y elevated) to show the disc in perspective.
 */
export default function UniverseCamera() {
  const { camera, pointer } = useThree();

  const smooth = useRef({ x: 0, y: 0 });
  const BASE_X = -12;
  const BASE_Y = 22;
  const BASE_Z = 75;

  useFrame((_, d) => {
    // Exponential smoothing — framerate independent
    const k = 1 - Math.pow(0.015, d);
    smooth.current.x += (pointer.x - smooth.current.x) * k;
    smooth.current.y += (pointer.y - smooth.current.y) * k;

    camera.position.x += (BASE_X + smooth.current.x * 4.0 - camera.position.x) * d * 1.8;
    camera.position.y += (BASE_Y + smooth.current.y * 3.0 - camera.position.y) * d * 1.8;
    camera.position.z += (BASE_Z                           - camera.position.z) * d * 1.8;

    camera.lookAt(
      smooth.current.x * 0.8 + 5,
      smooth.current.y * 0.5 - 2,
      0,
    );
  });

  return null;
}
