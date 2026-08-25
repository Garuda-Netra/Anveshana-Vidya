export function SceneLights() {
  return (
    <>
      {/* Universal Ambient Fill */}
      <ambientLight intensity={1.8} />

      {/* Hemisphere Light for Realistic Sky/Ground Bounce */}
      <hemisphereLight args={['#d4eaf7', '#151d30', 2.0]} />

      {/* Key Front-Top Light */}
      <directionalLight position={[8, 14, 12]} intensity={2.5} color="#ffffff" />

      {/* Cyber Neon Cyan Fill Light */}
      <directionalLight position={[-12, 10, 10]} intensity={2.0} color="#00f3ff" />

      {/* Purple Back Rim Light */}
      <directionalLight position={[0, 10, -12]} intensity={2.2} color="#a855f7" />

      {/* Under-Glow Fill */}
      <pointLight position={[0, -5, 8]} intensity={1.5} color="#38bdf8" />

      {/* Top Center Spotlight */}
      <spotLight
        position={[0, 15, 0]}
        intensity={2.0}
        angle={0.8}
        penumbra={0.5}
        color="#ffffff"
      />
    </>
  );
}
