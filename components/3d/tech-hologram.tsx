"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Box, Sphere, Torus } from "@react-three/drei"
import type * as THREE from "three"

function HologramElements() {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const boxRef = useRef<THREE.Mesh>(null)
  const torusRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }

    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
      sphereRef.current.rotation.x += 0.02
    }

    if (boxRef.current) {
      boxRef.current.rotation.x += 0.01
      boxRef.current.rotation.z += 0.01
    }

    if (torusRef.current) {
      torusRef.current.rotation.x += 0.02
      torusRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central sphere */}
      <Sphere ref={sphereRef} args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B5CF6" wireframe transparent opacity={0.6} />
      </Sphere>

      {/* Floating cubes */}
      <Box ref={boxRef} args={[0.3, 0.3, 0.3]} position={[1.5, 0.5, 0]}>
        <meshStandardMaterial color="#A855F7" transparent opacity={0.7} />
      </Box>

      <Box args={[0.2, 0.2, 0.2]} position={[-1.2, -0.8, 0.5]}>
        <meshStandardMaterial color="#EC4899" wireframe transparent opacity={0.8} />
      </Box>

      {/* Torus */}
      <Torus ref={torusRef} args={[0.8, 0.1, 16, 100]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#8B5CF6" transparent opacity={0.5} />
      </Torus>

      {/* Data particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.02, 8, 8]}
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 2,
            Math.sin((i / 12) * Math.PI * 2) * 0.5,
            Math.sin((i / 12) * Math.PI * 2) * 2,
          ]}
        >
          <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={0.5} />
        </Sphere>
      ))}
    </group>
  )
}

export default function TechHologram() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8B5CF6" />

        <HologramElements />
      </Canvas>
    </div>
  )
}
