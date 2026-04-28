import React, { useMemo } from 'react';
import { usePlane } from '@react-three/cannon';
import * as THREE from 'three';

export function CheckeredFloor() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 128); ctx.fillRect(128, 128, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50);
    tex.magFilter = THREE.NearestFilter;
    return tex;
  }, []);

  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0],
    type: 'Static' 
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial map={texture} roughness={0.8} />
    </mesh>
  );
}