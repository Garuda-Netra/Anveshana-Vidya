import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SSDModel() {
  const groupRef = useRef<THREE.Group>(null);
  const controllerLedRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
    }
    if (controllerLedRef.current) {
      const pulse = (Math.sin(t * 8) + 1) / 2;
      (controllerLedRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0 + pulse * 2.0;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.45, -0.25, 0]}>
      {/* High-Grade Multi-layer PCB Board (Emerald Cyber Green) */}
      <mesh>
        <boxGeometry args={[2.6, 0.08, 4.4]} />
        <meshStandardMaterial color="#059669" roughness={0.4} />
      </mesh>
      {/* PCB Circuit Traces */}
      <mesh position={[0, 0.045, 0]}>
        <planeGeometry args={[2.4, 4.2]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.3} />
      </mesh>

      {/* NVMe PCIe Controller Chip & Aluminum Heatsink */}
      <group position={[0, 0.12, -1.0]}>
        <mesh>
          <boxGeometry args={[1.0, 0.14, 1.0]} />
          <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Silicon Core Label */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.7]} />
          <meshBasicMaterial color="#00f3ff" />
        </mesh>
        {/* Controller Activity Status LED */}
        <mesh ref={controllerLedRef} position={[0.4, 0.08, 0.4]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* 3D NAND Flash Memory Dies with Wear-Leveling Visualizers */}
      <group position={[0, 0.1, 0.7]}>
        {[
          { x: -0.65, z: -0.6 },
          { x: 0.65, z: -0.6 },
          { x: -0.65, z: 0.8 },
          { x: 0.65, z: 0.8 },
        ].map((pos, idx) => (
          <group key={idx} position={[pos.x, 0, pos.z]}>
            <mesh>
              <boxGeometry args={[0.9, 0.12, 1.1]} />
              <meshStandardMaterial color="#334155" roughness={0.4} />
            </mesh>
            {/* Flash Die Layer Indicators */}
            <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.75, 0.9]} />
              <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Gold-Plated M.2 PCIe Edge Connector Pins */}
      <mesh position={[0, 0, -2.25]}>
        <boxGeometry args={[1.8, 0.06, 0.2]} />
        <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.4} roughness={0.2} />
      </mesh>
    </group>
  );
}
