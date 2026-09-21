'use client';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * SpaceCamera — Cinematic camera with:
 * - Slow drift at rest
 * - Mouse parallax
 * - Drag orbit (via OrbitControls)
 * - Scroll zoom
 */
export default function SpaceCamera() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Imperceptible camera drift
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Very slow sinusoidal drift
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      Math.sin(t * 0.06) * 0.7 + state.pointer.x * 0.75,
      0.012
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      Math.cos(t * 0.05) * 0.4 + state.pointer.y * 0.55 + 7,
      0.012
    );
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.22}
      zoomSpeed={0.36}
      minDistance={22}
      maxDistance={52}
      maxPolarAngle={Math.PI * 0.75}
      minPolarAngle={Math.PI * 0.15}
    />
  );
}
