import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DataCarvingModel() {
  const groupRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Group>(null);
  const carvedBlockRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
    }

    if (scannerRef.current) {
      scannerRef.current.position.y = Math.sin(t * 2.2) * 1.3;
    }

    if (carvedBlockRef.current) {
      const pulse = (Math.sin(t * 5) + 1) / 2;
      carvedBlockRef.current.scale.set(1 + pulse * 0.15, 1 + pulse * 0.15, 1 + pulse * 0.15);
    }
  });

  // Cluster matrix coordinates: 3x3x3 sector grid
  const clusters = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const isHeader = x === 0 && y === 0 && z === 1;
        const isCarved = (x === -1 && y === 0 && z === 0) || (x === 1 && y === 1 && z === 0);
        const isUnallocated = !isHeader && !isCarved && (x + y + z) % 2 === 0;
        clusters.push({ pos: [x * 0.95, y * 0.95, z * 0.95] as [number, number, number], isHeader, isCarved, isUnallocated });
      }
    }
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 3D Cluster Sector Grid */}
      {clusters.map((c, i) => (
        <mesh
          key={i}
          ref={c.isHeader ? carvedBlockRef : undefined}
          position={c.pos}
        >
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          {c.isHeader ? (
            // Magic Byte Header (e.g. 0x89PNG or 0xFFD8)
            <meshStandardMaterial
              color="#39ff14"
              emissive="#39ff14"
              emissiveIntensity={2.0}
              roughness={0.2}
            />
          ) : c.isCarved ? (
            // Reconstructed payload fragment
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.0}
              roughness={0.3}
            />
          ) : c.isUnallocated ? (
            // Unallocated slack space
            <meshStandardMaterial
              color="#a855f7"
              transparent
              opacity={0.5}
              wireframe
            />
          ) : (
            // Active filesystem cluster
            <meshStandardMaterial
              color="#64748b"
              roughness={0.4}
              metalness={0.2}
            />
          )}
        </mesh>
      ))}

      {/* Laser Carving Scanner Plane */}
      <group ref={scannerRef} position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.6, 3.6]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.7, 1.76, 32]} />
          <meshBasicMaterial color="#00f3ff" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Reconstructed File Stream Vector */}
      <mesh position={[0, -1.9, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.9, 12]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2.0} />
      </mesh>
    </group>
  );
}
