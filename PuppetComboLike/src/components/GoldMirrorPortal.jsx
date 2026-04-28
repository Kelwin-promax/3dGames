// src/components/GoldMirrorPortal.jsx
import React, { useRef } from 'react';
import { Float, CubeCamera, meshBounds } from '@react-three/drei';

export function GoldMirrorPortal({ position, projectData, onProjectHover, onProjectClick }) {
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Moldura Dourada */}
        <mesh castShadow>
          <torusGeometry args={[3.2, 0.4, 16, 100]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} />
        </mesh>
        
        {/* Espelho/Portal */}
        <CubeCamera frames={1} resolution={256}>
          {(texture) => (
            <mesh 
              onPointerOver={() => onProjectHover && onProjectHover(projectData)} 
              onPointerOut={() => onProjectHover && onProjectHover(null)} 
              onClick={() => onProjectClick && onProjectClick(projectData)}
              raycast={meshBounds}
            >
              <circleGeometry args={[2.8, 64]} />
              <meshStandardMaterial 
                envMap={texture} 
                color="#00ffff" 
                emissive="#0055ff" 
                emissiveIntensity={1} 
                roughness={0} 
              />
            </mesh>
          )}
        </CubeCamera>
      </Float>
    </group>
  );
}

export default GoldMirrorPortal;