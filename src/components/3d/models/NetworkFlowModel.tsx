import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NetworkFlowModel() {
  const groupRef = useRef<THREE.Group>(null);
  const packetRef1 = useRef<THREE.Mesh>(null);
  const packetRef2 = useRef<THREE.Mesh>(null);
  const packetRef3 = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.18;
    }

    // Packet 1: Client to Router (Cyan)
    if (packetRef1.current) {
      const p = (t * 1.5) % 1;
      packetRef1.current.position.set(-2 + p * 2, 0, -1 + p * 1);
    }

    // Packet 2: Router to Server (Neon Green)
    if (packetRef2.current) {
      const p = ((t + 0.3) * 1.2) % 1;
      packetRef2.current.position.set(0 + p * 2, 0, 0 + p * 1);
    }

    // Packet 3: Suspicious C2 Beacon stream to Attacker (Red/Magenta)
    if (packetRef3.current) {
      const p = ((t + 0.6) * 1.8) % 1;
      packetRef3.current.position.set(0 + p * 0, 0 + p * 2, 0 - p * 2);
    }

    // Pulsing C2 beacon node
    if (beaconRef.current) {
      const scale = 1 + Math.sin(t * 6) * 0.25;
      beaconRef.current.scale.set(scale, scale, scale);
    }

    // Rotating firewall scan rings
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
      ringRef.current.rotation.x = t * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Network Router / Core Gateway */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.42, 32]} />
        <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>

      {/* Router Status Dome */}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1.5} />
      </mesh>

      {/* Node 1: Client Host (Left) */}
      <group position={[-2, 0, -1]}>
        <mesh>
          <boxGeometry args={[0.75, 0.75, 0.75]} />
          <meshStandardMaterial color="#475569" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.85, 0.55, 0.06]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Node 2: Database Server (Right) */}
      <group position={[2, 0, 1]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 1.3, 24]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.09, 24]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.09, 24]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* Node 3: Suspicious C2 Node (Top Back) */}
      <group position={[0, 2, -2]}>
        <mesh ref={beaconRef}>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} wireframe />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Firewall Barrier / Inspection Shield */}
      <group ref={ringRef} position={[0, 1, -1]}>
        <mesh>
          <torusGeometry args={[0.85, 0.035, 16, 32]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.65, 0.025, 16, 32]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Network Connection Lines (Pipes) */}
      <mesh position={[-1, 0, -0.5]} rotation={[0, Math.atan2(1, 2), 0]}>
        <cylinderGeometry args={[0.035, 0.035, 2.23, 12]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>

      <mesh position={[1, 0, 0.5]} rotation={[0, -Math.atan2(1, 2), 0]}>
        <cylinderGeometry args={[0.035, 0.035, 2.23, 12]} />
        <meshBasicMaterial color="#39ff14" />
      </mesh>

      <mesh position={[0, 1, -1]} rotation={[Math.atan2(2, 2), 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 2.82, 12]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Moving Packets */}
      <mesh ref={packetRef1} position={[-2, 0, -1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={3} />
      </mesh>

      <mesh ref={packetRef2} position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3} />
      </mesh>

      <mesh ref={packetRef3} position={[0, 0, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={3.5} />
      </mesh>

      {/* Base Grid Plane */}
      <gridHelper args={[8, 8, '#00f3ff', '#475569']} position={[0, -0.8, 0]} />
    </group>
  );
}
