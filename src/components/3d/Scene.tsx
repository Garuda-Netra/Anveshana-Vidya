import { useRef, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[Scene] WebGL background render fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function HolographicForensicCore() {
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.x += delta * 0.15;
      outerMeshRef.current.rotation.y += delta * 0.2;
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x -= delta * 0.25;
      innerMeshRef.current.rotation.z += delta * 0.3;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.35;
    if (nodesGroupRef.current) nodesGroupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group>
        {/* Outer Hex Shield */}
        <mesh ref={outerMeshRef}>
          <icosahedronGeometry args={[2.4, 1]} />
          <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.12} />
        </mesh>

        {/* Mid Cryptographic Core */}
        <mesh ref={innerMeshRef} scale={[0.7, 0.7, 0.7]}>
          <dodecahedronGeometry args={[2, 0]} />
          <meshBasicMaterial color="#39ff14" wireframe transparent opacity={0.25} />
        </mesh>

        {/* Inner Glowing Evidence Seed */}
        <mesh scale={[0.35, 0.35, 0.35]}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
        </mesh>

        {/* Orbiting Orbital Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.8, 0.015, 16, 64]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} />
        </mesh>
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.1, 0.015, 16, 64]} />
          <meshBasicMaterial color="#39ff14" transparent opacity={0.3} />
        </mesh>
        <mesh ref={ring3Ref} rotation={[-Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.4, 0.015, 16, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.35} />
        </mesh>

        {/* Orbiting Forensic Evidence Nodes */}
        <group ref={nodesGroupRef}>
          {[0, (2 * Math.PI) / 5, (4 * Math.PI) / 5, (6 * Math.PI) / 5, (8 * Math.PI) / 5].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 3.2, Math.sin(angle) * 0.8, Math.sin(angle) * 3.2]}
            >
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#00f3ff' : '#39ff14'} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
      <SceneErrorBoundary>
        <Canvas camera={{ position: [0, 0, 9] }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={0.8} />
          <HolographicForensicCore />
          <Stars radius={120} depth={60} count={2500} factor={4} saturation={0.5} fade speed={1.2} />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
