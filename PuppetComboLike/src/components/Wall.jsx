// src/components/Wall.jsx
import React from 'react';

export function Wall({ position, rotation, scale }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#ddd" roughness={0.8} />
    </mesh>
  );
}