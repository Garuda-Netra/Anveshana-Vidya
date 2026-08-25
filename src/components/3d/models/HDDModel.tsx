import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HDDModel() {
  const groupRef = useRef<THREE.Group>(null);
  const platterRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const laserHeadRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
    }

    if (platterRef.current) {
      // Spin the platter
      platterRef.current.rotation.y += 0.12;
    }
    if (armRef.current) {
      // Move the actuator arm across magnetic tracks
      armRef.current.rotation.y = Math.sin(t * 3.5) * 0.25 + 0.45;
    }
    if (laserHeadRef.current) {
      const pulse = (Math.sin(t * 12) + 1) / 2;
      (laserHeadRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0 + pulse * 2.0;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.45, 0, 0]}>
      {/* Heavy Aluminum HDD Drive Chassis */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[3.6, 0.28, 4.8]} />
        <meshStandardMaterial color="#475569" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Cyber Perimeter Trim */}
      <mesh position={[0, -0.2, 2.42]}>
        <boxGeometry args={[3.62, 0.06, 0.04]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>

      {/* Recessed Platter Well Base */}
      <mesh position={[0, -0.05, 0.2]}>
        <cylinderGeometry args={[1.7, 1.7, 0.04, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Spinning Magnetic Platters Group */}
      <group ref={platterRef} position={[0, 0.08, 0.2]}>
        {/* Mirror Polished Platter */}
        <mesh>
          <cylinderGeometry args={[1.55, 1.55, 0.06, 48]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.15} />
        </mesh>
        {/* Track Concentric Rings */}
        {[0.6, 0.9, 1.2, 1.45].map((r, i) => (
          <mesh key={i} position={[0, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r, r + 0.02, 32]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#38bdf8' : '#39ff14'} />
          </mesh>
        ))}
        {/* Center Motor Spindle Hub */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.12, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* Actuator Voice-Coil Arm Group */}
      <group ref={armRef} position={[1.15, 0.18, 1.3]} rotation={[0, 0.45, 0]}>
        {/* Voice-Coil Magnet Base */}
        <mesh position={[0.2, 0, 0.2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.18, 24]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Pivot Bearing */}
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.26, 20]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.2} />
        </mesh>
        {/* Precision Arm Shank */}
        <mesh position={[-0.95, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.9, 0.04, 0.16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.3} roughness={0.3} />
        </mesh>
        {/* Read/Write Slider Head with Active Forensic Laser */}
        <mesh ref={laserHeadRef} position={[-1.92, -0.04, 0]}>
          <boxGeometry args={[0.12, 0.08, 0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
        </mesh>
      </group>
    </group>
  );
}
