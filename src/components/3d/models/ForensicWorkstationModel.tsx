import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ForensicWorkstationModel() {
  const groupRef = useRef<THREE.Group>(null);
  const writeBlockerLedRef = useRef<THREE.Mesh>(null);
  const dataStreamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.2 + 0.3;
    }

    if (writeBlockerLedRef.current) {
      const pulse = (Math.sin(t * 8) + 1) / 2;
      (writeBlockerLedRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0 + pulse * 2.0;
    }

    if (dataStreamRef.current) {
      const p = (t * 2) % 1;
      dataStreamRef.current.position.x = -1.2 + p * 2.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Desk Base Surface (Brushed Cyber Slate with Neon Edge Trim) */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[4.8, 0.12, 3.0]} />
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* Desk Neon Trim */}
      <mesh position={[0, -1.2, 1.51]}>
        <boxGeometry args={[4.82, 0.04, 0.04]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>
      <mesh position={[0, -1.2, -1.51]}>
        <boxGeometry args={[4.82, 0.04, 0.04]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>

      {/* Center Left Monitor (Autopsy / Timeline UI) */}
      <group position={[-1.0, 0.0, -0.4]} rotation={[0, 0.15, 0]}>
        {/* Monitor Bezel & Frame */}
        <mesh>
          <boxGeometry args={[1.9, 1.3, 0.08]} />
          <meshStandardMaterial color="#475569" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Glowing Screen Content */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.78, 1.18]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.8} roughness={0.2} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* Center Right Monitor (Volatility / Memory Hex View) */}
      <group position={[1.0, 0.0, -0.4]} rotation={[0, -0.2, 0]}>
        {/* Monitor Bezel & Frame */}
        <mesh>
          <boxGeometry args={[1.9, 1.3, 0.08]} />
          <meshStandardMaterial color="#475569" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Glowing Screen Content */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.78, 1.18]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} roughness={0.2} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* Hardware Write-Blocker (Tableau / CRU Forensic Bridge) */}
      <group position={[-1.3, -0.95, 0.6]}>
        <mesh>
          <boxGeometry args={[1.1, 0.28, 0.7]} />
          <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Write-Blocker Status Screen */}
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.35]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1.2} />
        </mesh>
        {/* Write-Block Active Status LED */}
        <mesh ref={writeBlockerLedRef} position={[0.42, 0.15, 0.22]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Evidence Target Drive Caddy */}
      <group position={[1.3, -0.95, 0.6]}>
        <mesh>
          <boxGeometry args={[0.9, 0.32, 1.2]} />
          <meshStandardMaterial color="#475569" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Drive Label */}
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.9]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>
        {/* Activity LED */}
        <mesh position={[0.32, 0.17, 0.45]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* High-Speed PCIe / USB 3.2 Cable Bridge */}
      <mesh position={[0, -1.05, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 2.4, 16]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.6} />
      </mesh>

      {/* Moving Forensic Ingest Packet Indicator */}
      <mesh ref={dataStreamRef} position={[0, -1.0, 0.6]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3} />
      </mesh>

      {/* Forensic Keyboard & Mouse on Desk */}
      <group position={[0, -1.1, 0.8]}>
        {/* Keyboard */}
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.45]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[-0.2, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 0.38]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Mouse */}
        <mesh position={[0.65, 0.02, 0]}>
          <boxGeometry args={[0.18, 0.06, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
