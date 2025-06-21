"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Box, OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"

function TechCube() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05

      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2

      // Scale on hover
      const targetScale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group>
      {/* Main cube with wireframe */}
      <Box ref={meshRef} args={[2, 2, 2]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <meshStandardMaterial color="#8B5CF6" transparent opacity={0.1} wireframe={false} />
      </Box>

      {/* Wireframe overlay */}
      <Box args={[2.01, 2.01, 2.01]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={hovered ? 0.8 : 0.4} />
      </Box>

      {/* Inner glowing core */}
      <Box args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color="#A855F7" emissive="#8B5CF6" emissiveIntensity={hovered ? 0.5 : 0.2} />
      </Box>

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box
          key={i}
          args={[0.05, 0.05, 0.05]}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 3,
            Math.sin((i / 8) * Math.PI * 2) * 0.5,
            Math.sin((i / 8) * Math.PI * 2) * 3,
          ]}
        >
          <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={0.3} />
        </Box>
      ))}
    </group>
  )
}

export default function FloatingCube() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />

        <TechCube />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
