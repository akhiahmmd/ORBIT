'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Smooth exponential-lag camera that gently follows mouse pointer.
 * Camera is parked at an angle (y elevated) to show the disc in perspective.
 *
 * Base position: [2, 9, 28] — slightly right and above, looking at origin.
 * Mouse moves camera ±2 on X and ±1.5 on Y over its full range.
 */
export default function UniverseCamera() {
  const { camera, pointer } = useThree();

  const smooth = useRef({ x: 0, y: 0 });
  const BASE_X = -6;
  const BASE_Y = 12;
  const BASE_Z = 34;

  useFrame((_, d) => {
    // Exponential smoothing — framerate independent
    const k = 1 - Math.pow(0.015, d);
    smooth.current.x += (pointer.x - smooth.current.x) * k;
    smooth.current.y += (pointer.y - smooth.current.y) * k;

    camera.position.x += (BASE_X + smooth.current.x * 2.0 - camera.position.x) * d * 1.8;
    camera.position.y += (BASE_Y + smooth.current.y * 1.5 - camera.position.y) * d * 1.8;
    camera.position.z += (BASE_Z                           - camera.position.z) * d * 1.8;

    camera.lookAt(
      smooth.current.x * 0.4 + 3,
      smooth.current.y * 0.3 - 1,
      0,
    );
  });

  return null;
}
