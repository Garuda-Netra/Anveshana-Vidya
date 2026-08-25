import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function StegoMatrixModel() {
  const groupRef = useRef<THREE.Group>(null);
  const hiddenPlaneRef = useRef<THREE.Group>(null);
  const laserScannerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.45 + 0.5;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 + 0.25;
    }

    if (hiddenPlaneRef.current) {
      // Oscillate hidden payload layer separation
      hiddenPlaneRef.current.position.z = Math.sin(t * 1.5) * 0.45 + 0.85;
    }

    if (laserScannerRef.current) {
      laserScannerRef.current.position.y = Math.sin(t * 2.5) * 1.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Carrier Image Plane (Red Channel) */}
      <group position={[0, 0, -0.6]}>
        <mesh>
          <boxGeometry args={[2.8, 2.8, 0.06]} />
          <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
        <mesh>
          <boxGeometry args={[2.84, 2.84, 0.02]} />
          <meshBasicMaterial color="#fb7185" wireframe />
        </mesh>
      </group>

      {/* Carrier Image Plane (Green Channel) */}
      <group position={[0, 0, -0.1]}>
        <mesh>
          <boxGeometry args={[2.8, 2.8, 0.06]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
        <mesh>
          <boxGeometry args={[2.84, 2.84, 0.02]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>
      </group>

      {/* Carrier Image Plane (Blue Channel) */}
      <group position={[0, 0, 0.4]}>
        <mesh>
          <boxGeometry args={[2.8, 2.8, 0.06]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
        <mesh>
          <boxGeometry args={[2.84, 2.84, 0.02]} />
          <meshBasicMaterial color="#38bdf8" wireframe />
        </mesh>
      </group>

      {/* Extracted LSB (Least Significant Bit) Hidden Payload Layer */}
      <group ref={hiddenPlaneRef} position={[0, 0, 0.95]}>
        <mesh>
          <boxGeometry args={[2.8, 2.8, 0.08]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={1.8}
            wireframe
          />
        </mesh>

        {/* Embedded Secret Bits (Glowing points) */}
        {[-0.9, -0.45, 0, 0.45, 0.9].map((x, xi) =>
          [-0.9, -0.45, 0, 0.45, 0.9].map((y, yi) => (
            <mesh key={`bit-${xi}-${yi}`} position={[x, y, 0.06]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial
                color={(xi + yi) % 2 === 0 ? '#39ff14' : '#00f3ff'}
                emissive={(xi + yi) % 2 === 0 ? '#39ff14' : '#00f3ff'}
                emissiveIntensity={2.5}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Laser Scanner Bar */}
      <mesh ref={laserScannerRef} position={[0, 0, 0.6]}>
        <boxGeometry args={[3.2, 0.06, 0.06]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>
    </group>
  );
}
