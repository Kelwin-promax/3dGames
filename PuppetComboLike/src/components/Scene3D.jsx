import React, { useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, KeyboardControls, useKeyboardControls } from '@react-three/drei';
import { Physics, useBox, useSphere } from '@react-three/cannon';
import * as THREE from 'three';

// IMPORTAÇÕES (Apenas uma vez cada)
import { Ceiling } from './Ceiling'; 
import { CheckeredFloor } from './CheckeredFloor';

// Componentes internos (apenas os que não estão em arquivos separados)
function WallUnit({ position, rotation }) {
  const [ref] = useBox(() => ({ type: 'Static', position, rotation, args: [8.2, 5, 0.5] }));
  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[8.2, 5, 0.5]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 0, 0.4]}>
        <boxGeometry args={[3.6, 4.6, 0.2]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Player() {
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();
  const [ref, api] = useSphere(() => ({ mass: 1, type: 'Dynamic', position: [0, 1.6, 0], args: [0.5] }));

  useFrame(() => {
    camera.position.copy(ref.current.position);
    camera.position.y = 1.6;
    const { forward, backward, left, right } = getKeys();
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(5).applyEuler(camera.rotation);
    api.velocity.set(direction.x, 0, direction.z);
  });
  return <mesh ref={ref} />;
}

export function Scene3D() {
  const map = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  ], []);

  const walls = [
    { pos: [0, 2.5, -7.1], rot: [0, 0, 0] },
    { pos: [6.15, 2.5, -3.55], rot: [0, -Math.PI / 3, 0] },
    { pos: [6.15, 2.5, 3.55], rot: [0, -2 * Math.PI / 3, 0] },
    { pos: [0, 2.5, 7.1], rot: [0, Math.PI, 0] },
    { pos: [-6.15, 2.5, 3.55], rot: [0, 2 * Math.PI / 3, 0] },
    { pos: [-6.15, 2.5, -3.55], rot: [0, Math.PI / 3, 0] },
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: '#000' }}>
      <KeyboardControls map={map}>
        <Canvas shadows camera={{ position: [0, 1.6, 0], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 10, 5]} intensity={1.5} castShadow />
          <Physics gravity={[0, 0, 0]}>
            <PointerLockControls />
            <Player />
            <CheckeredFloor />
            <Ceiling />
            {walls.map((w, i) => <WallUnit key={i} position={w.pos} rotation={w.rot} />)}
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}