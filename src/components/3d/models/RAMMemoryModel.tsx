import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RAMMemoryModel() {
  const groupRef = useRef<THREE.Group>(null);
  const scanLaserRef = useRef<THREE.Mesh>(null);
  const injectedChipRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.1;
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.25 + 0.3;
    }

    // Laser scanning across memory address space
    if (scanLaserRef.current) {
      scanLaserRef.current.position.x = Math.sin(t * 2.5) * 1.9;
    }

    // Injected malicious shellcode / hook region blinking
    if (injectedChipRef.current) {
      const pulse = (Math.sin(t * 6) + 1) / 2;
      (injectedChipRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0 + pulse * 2.5;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      {/* RAM PCB Stick (Rich Cyber Green) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.8, 1.5, 0.09]} />
        <meshStandardMaterial color="#047857" roughness={0.35} />
      </mesh>

      {/* Gold Contact Fingers (Bottom) */}
      <mesh position={[0, -0.72, 0]}>
        <boxGeometry args={[4.6, 0.16, 0.1]} />
        <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.4} roughness={0.2} />
      </mesh>

      {/* Notch in PCB */}
      <mesh position={[0.2, -0.72, 0]}>
        <boxGeometry args={[0.2, 0.22, 0.14]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* DRAM Chips Row (Front) */}
      {[-1.6, -0.8, 0.8, 1.6].map((x, idx) => (
        <group key={`chip-front-${idx}`} position={[x, 0.1, 0.07]}>
          <mesh>
            <boxGeometry args={[0.68, 0.75, 0.08]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
          {/* Chip Label & Pins */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[0.55, 0.45]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Suspicious Injected Process Memory Chip (0x7FFF... Hooked) */}
      <group position={[0, 0.1, 0.07]}>
        <mesh ref={injectedChipRef}>
          <boxGeometry args={[0.68, 0.75, 0.08]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={2.0}
            roughness={0.2}
          />
        </mesh>
        {/* Warning Indicator on infected memory block */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[0.55, 0.45]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Volatility Memory Scanning Laser Beam */}
      <mesh ref={scanLaserRef} position={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.03, 0.03, 1.9, 12]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>

      {/* Memory Address Pin Markers */}
      {[-2.1, -1.6, -1.1, -0.6, 0.6, 1.1, 1.6, 2.1].map((x, i) => (
        <mesh key={`pin-${i}`} position={[x, 0.65, 0.06]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}
