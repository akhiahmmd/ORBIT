'use client';
import { Canvas } from '@react-three/fiber';
import ImmersiveUniverse from './ImmersiveUniverse';

export default function SceneManager() {
  return (
    <div className="fixed inset-0 z-0 bg-[#010204] pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <ImmersiveUniverse />
      </Canvas>
      {/* Vignette Overlay for cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#010204_100%)] pointer-events-none opacity-80"></div>
    </div>
  );
}
