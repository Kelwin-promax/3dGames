import React from 'react';

export function Stairs({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.3, i * 0.4]} castShadow receiveShadow>
          <boxGeometry args={[4, 0.3, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}
    </group>
  );
}