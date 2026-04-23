import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky, Environment, Stars, KeyboardControls, useKeyboardControls, Float, MeshDistortMaterial, CubeCamera } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

function Player({ isControlsEnabled }) {
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    if (!isControlsEnabled) return;
    const { forward, backward, left, right } = getKeys();
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * delta)
      .applyQuaternion(camera.quaternion);

    camera.position.x += direction.x;
    camera.position.z += direction.z;
    camera.position.y = 1.6; 
  });
  return null;
}

function GoldMirrorPortal({ position, projectData, onProjectHover, onProjectClick }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.lookAt(state.camera.position.x, position[1], state.camera.position.z);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* MOLDURA DOURADA DETALHADA */}
        <mesh castShadow>
          {/* Usamos um Toro (anel) grosso para a moldura */}
          <torusGeometry args={[3.2, 0.4, 32, 100]} />
          <meshStandardMaterial 
            color="#FFD700" // Cor Ouro
            metalness={1} 
            roughness={0.2} 
            envMapIntensity={2} // Reflete o ambiente para parecer detalhado
          />
        </mesh>
        
        {/* ARO INTERNO DA MOLDURA */}
        <mesh>
          <ringGeometry args={[2.8, 3.2, 64]} />
          <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* ESPELHO MÁGICO (O Portal) */}
        <CubeCamera frames={Infinity} resolution={256} far={100}>
          {(texture) => (
            <mesh
              position={[0, 0, 0]}
              onPointerOver={() => onProjectHover(projectData)}
              onPointerOut={() => onProjectHover(null)}
              onClick={() => onProjectClick(projectData)}
            >
              <circleGeometry args={[2.8, 64]} />
              <MeshDistortMaterial 
                envMap={texture}
                speed={1.5}
                distort={0.2}
                color="#00ffff" // Brilho Mágico Azul
                emissive="#0055ff"
                emissiveIntensity={1.5}
                roughness={0}
                metalness={0.1}
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
        </CubeCamera>
      </Float>

      {/* LUZ MÁGICA SUAVE */}
      <pointLight position={[0, 0, 1]} intensity={20} color="#00ffff" distance={10} />
    </group>
  );
}

export function Scene3D({ onProjectHover, onProjectClick, isControlsEnabled }) {
  const map = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  ], []);

  return (
    <KeyboardControls map={map}>
      <Canvas shadows camera={{ position: [0, 1.6, 0], fov: 75 }} style={{ width: '100vw', height: '100vh' }}>
        <Suspense fallback={null}>
          <Sky distance={450000} sunPosition={[0, -1, 0]} inclination={0} azimuth={0.25} />
          <Stars radius={100} depth={50} count={6000} factor={5} saturation={0} fade speed={1.5} />
          <ambientLight intensity={0.1} />
          <Environment preset="city" />

          {isControlsEnabled && <PointerLockControls />}
          <Player isControlsEnabled={isControlsEnabled} />

          {/* CHÃO: Reflexivo para valorizar o ouro */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
          </mesh>

          <GoldMirrorPortal position={[-18, 4.5, 0]} projectData={{ title: 'Nexus Engine', description: 'Motor gráfico.' }} onProjectHover={onProjectHover} onProjectClick={onProjectClick} />
          <GoldMirrorPortal position={[18, 4.5, 0]} projectData={{ title: 'DataFlow', description: 'Análise de dados.' }} onProjectHover={onProjectHover} onProjectClick={onProjectClick} />
          <GoldMirrorPortal position={[0, 4.5, -18]} projectData={{ title: 'Scania Goo', description: 'Logística.' }} onProjectHover={onProjectHover} onProjectClick={onProjectClick} />
          <GoldMirrorPortal position={[0, 4.5, 18]} projectData={{ title: 'HelpPet', description: 'Busca de pets.' }} onProjectHover={onProjectHover} onProjectClick={onProjectClick} />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}

export default Scene3D;