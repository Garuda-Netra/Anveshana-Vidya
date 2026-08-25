import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EvidenceVaultModel() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const hashTokenRef = useRef<THREE.Group>(null);
  const chainLinkStreamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.8;
      ring1Ref.current.rotation.z = t * 0.5;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.9;
      ring2Ref.current.rotation.x = t * 0.6;
    }

    if (hashTokenRef.current) {
      hashTokenRef.current.position.y = 1.6 + Math.sin(t * 2) * 0.15;
      hashTokenRef.current.rotation.y = t * 1.2;
    }

    if (chainLinkStreamRef.current) {
      const p = (t * 2) % 1;
      chainLinkStreamRef.current.position.x = -1.6 + p * 3.2;
    }
  });

  // 3 Sequential Cryptographic Chain-of-Custody Blocks
  const chainBlocks = [
    { x: -1.6, label: '01: Ingest & Image', color: '#0ea5e9', emissive: '#0284c7' },
    { x: 0, label: '02: SHA-256 Custody Hash', color: '#10b981', emissive: '#059669' },
    { x: 1.6, label: '03: Court Admissible', color: '#a855f7', emissive: '#7e22ce' },
  ];

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Heavy Base Forensic Vault Platform */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.3, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Platform Neon Trim */}
      <mesh position={[0, -1.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.52, 0.03, 16, 32]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>

      {/* Central High-Security Cryptographic Evidence Safe */}
      <group position={[0, -0.2, 0]}>
        {/* Main Safe Enclosure */}
        <mesh>
          <boxGeometry args={[1.8, 2.0, 1.8]} />
          <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Safe Door Frame */}
        <mesh position={[0, 0, 0.91]}>
          <boxGeometry args={[1.5, 1.7, 0.08]} />
          <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.4} />
        </mesh>

        {/* Golden Biometric & Combination Vault Wheel */}
        <group position={[0, 0.1, 0.96]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
            <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.5} roughness={0.2} />
          </mesh>
          {/* Wheel Spokes */}
          {[0, Math.PI / 3, (2 * Math.PI) / 3].map((ang, i) => (
            <mesh key={i} rotation={[0, 0, ang]}>
              <boxGeometry args={[0.9, 0.05, 0.06]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.2} />
            </mesh>
          ))}
          {/* Center Fingerprint/Retina Sensor */}
          <mesh position={[0, 0, 0.06]}>
            <circleGeometry args={[0.15, 16]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2.0} />
          </mesh>
        </group>

        {/* SHA-256 Digital Verification Screen */}
        <mesh position={[0, -0.55, 0.96]}>
          <planeGeometry args={[1.1, 0.25]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* 3D Linked Blockchain / Chain-of-Custody Nodes */}
      {chainBlocks.map((block, i) => (
        <group key={i} position={[block.x, 0.7, 0]}>
          {/* Transparent Cryptographic Ledger Block */}
          <mesh>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial
              color={block.color}
              emissive={block.emissive}
              emissiveIntensity={1.2}
              transparent
              opacity={0.7}
              roughness={0.2}
            />
          </mesh>
          {/* Glowing Wireframe Border */}
          <mesh>
            <boxGeometry args={[0.72, 0.72, 0.72]} />
            <meshBasicMaterial color="#ffffff" wireframe />
          </mesh>
          {/* Cryptographic Hash Core */}
          <mesh>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}

      {/* 3D Interlinking Chain Link Rings between Blocks */}
      {[-0.8, 0.8].map((x, i) => (
        <group key={`link-${i}`} position={[x, 0.7, 0]}>
          {/* Horizontal Ring */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.22, 0.04, 12, 24]} />
            <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.6} metalness={0.6} />
          </mesh>
          {/* Laser Link Beam */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
        </group>
      ))}

      {/* Dynamic Moving Chain-of-Custody Hash Particle */}
      <mesh ref={chainLinkStreamRef} position={[0, 0.7, 0.4]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3} />
      </mesh>

      {/* Floating Crown: Cryptographic Root Master Key */}
      <group ref={hashTokenRef} position={[0, 1.6, 0]}>
        {/* Floating Master Hash Diamond */}
        <mesh>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2.5} wireframe />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
        </mesh>

        {/* Orbiting Cryptographic Security Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.65, 0.015, 16, 32]} />
          <meshBasicMaterial color="#00f3ff" />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[0.75, 0.015, 16, 32]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </group>
    </group>
  );
}
