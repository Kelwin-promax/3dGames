import React, { useMemo } from 'react';
import * as THREE from 'three';

export function Ceiling() {
  // Criação da textura quadriculada para o teto
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; 
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Fundo escuro
    ctx.fillStyle = '#1a1a1a'; 
    ctx.fillRect(0, 0, 256, 256);
    
    // Quadrados brancos
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 128); 
    ctx.fillRect(128, 128, 128, 128);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 20); // Ajuste este valor se quiser quadrados maiores ou menores
    tex.magFilter = THREE.NearestFilter;
    return tex;
  }, []);

  return (
    <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
      {/* sphereGeometry args: 
        [radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength] 
        Math.PI / 2 no último parâmetro cria um hemisfério (cúpula)
      */}
      <sphereGeometry args={[15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      
      {/* BackSide é essencial para que você veja a textura de dentro da sala */}
      <meshStandardMaterial map={texture} side={THREE.BackSide} roughness={0.8} />
    </mesh>
  );
}