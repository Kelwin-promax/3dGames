// src/components/PaintingFrame.jsx
import React from 'react';

export function PaintingFrame({ position, rotation, onProjectClick }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Moldura Azul Mario 64 */}
      <mesh>
        <boxGeometry args={[3.4, 4.4, 0.4]} />
        <meshStandardMaterial color="#0055ff" />
      </mesh>
      {/* Área do quadro */}
      <mesh 
        position={[0, 0, 0.25]} 
        onClick={(e) => { e.stopPropagation(); onProjectClick?.(); }}
      >
        <planeGeometry args={[3, 4]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export default PaintingFrame;