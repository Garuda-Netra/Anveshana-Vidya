import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MobileForensicsModel() {
  const groupRef = useRef<THREE.Group>(null);
  const dataBeamRef = useRef<THREE.Mesh>(null);
  const probeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.3 + 0.2;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    }

    if (dataBeamRef.current) {
      const p = (t * 2.5) % 1;
      dataBeamRef.current.position.y = -1.5 + p * 3.0;
    }

    if (probeRef.current) {
      probeRef.current.rotation.z = Math.sin(t * 3) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Smartphone Chassis (Sleek Titanium Frame) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.3, 4.3, 0.22]} />
        <meshStandardMaterial color="#475569" metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Outer Polished Bezel Trim */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.36, 4.36, 0.18]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.2} />
      </mesh>

      {/* OLED Screen Surface */}
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[2.1, 4.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>

      {/* Screen Partition Visuals (Userdata, System, SQLite) */}
      <group position={[0, 0, 0.135]}>
        {/* /data partition (Cyan Banner) */}
        <mesh position={[0, 0.9, 0]}>
          <planeGeometry args={[1.8, 0.75]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>

        {/* /system partition (Purple Banner) */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.8, 0.75]} />
          <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={0.8} />
        </mesh>

        {/* SQLite Database Artifacts (Neon Green Banner) */}
        <mesh position={[0, -0.9, 0]}>
          <planeGeometry args={[1.8, 0.75]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Camera Module (Back) */}
      <mesh position={[0.6, 1.4, -0.15]}>
        <boxGeometry args={[0.7, 0.7, 0.1]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* JTAG / Cellebrite USB-C Extraction Bridge */}
      <group ref={probeRef} position={[0, -2.4, 0]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.85, 0.32, 0.18]} />
          <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.4} roughness={0.3} />
        </mesh>

        {/* Extraction Cable with Luminous Wire */}
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.9, 16]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* Forensic Data Stream Laser Indicator */}
      <mesh ref={dataBeamRef} position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}
