"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Box, Sphere, Cylinder } from "@react-three/drei"
import type * as THREE from "three"

function RobotHead({ isActive, isThinking }: { isActive: boolean; isThinking: boolean }) {
  const headRef = useRef<THREE.Group>(null)
  const eyeLeftRef = useRef<THREE.Mesh>(null)
  const eyeRightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (headRef.current) {
      // Head bobbing animation
      headRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05

      // Head rotation when thinking
      if (isThinking) {
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.2
      }
    }

    // Eye blinking animation
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 0.5) < -0.9 ? 0.1 : 1
      eyeLeftRef.current.scale.y = blink
      eyeRightRef.current.scale.y = blink
    }
  })

  return (
    <group ref={headRef}>
      {/* Head */}
      <Box args={[0.8, 0.6, 0.6]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color={isActive ? "#EC4899" : "#8B5CF6"} metalness={0.8} roughness={0.2} />
      </Box>

      {/* Eyes */}
      <Sphere ref={eyeLeftRef} args={[0.08, 16, 16]} position={[-0.15, 0.35, 0.25]}>
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={isActive ? 0.8 : 0.4} />
      </Sphere>
      <Sphere ref={eyeRightRef} args={[0.08, 16, 16]} position={[0.15, 0.35, 0.25]}>
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={isActive ? 0.8 : 0.4} />
      </Sphere>

      {/* Antenna */}
      <Cylinder args={[0.02, 0.02, 0.3]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#A855F7" />
      </Cylinder>
      <Sphere args={[0.05, 16, 16]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={isActive ? 0.6 : 0.3} />
      </Sphere>
    </group>
  )
}

function RobotBody({ isActive }: { isActive: boolean }) {
  const bodyRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (bodyRef.current) {
      // Gentle breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02
      bodyRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      {/* Main body */}
      <Box ref={bodyRef} args={[0.6, 0.8, 0.4]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color={isActive ? "#A855F7" : "#6366F1"} metalness={0.7} roughness={0.3} />
      </Box>

      {/* Chest panel */}
      <Box args={[0.4, 0.3, 0.05]} position={[0, -0.1, 0.225]}>
        <meshStandardMaterial color="#1F2937" emissive={isActive ? "#8B5CF6" : "#4F46E5"} emissiveIntensity={0.2} />
      </Box>

      {/* Arms */}
      <Cylinder args={[0.08, 0.08, 0.5]} position={[-0.45, -0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#6366F1" metalness={0.6} roughness={0.4} />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.5]} position={[0.45, -0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial color="#6366F1" metalness={0.6} roughness={0.4} />
      </Cylinder>

      {/* Hands */}
      <Sphere args={[0.1, 16, 16]} position={[-0.65, -0.35, 0]}>
        <meshStandardMaterial color="#8B5CF6" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.65, -0.35, 0]}>
        <meshStandardMaterial color="#8B5CF6" />
      </Sphere>
    </group>
  )
}

interface RobotModelProps {
  isActive: boolean
  isThinking: boolean
  onClick: () => void
}

export default function RobotModel({ isActive, isThinking, onClick }: RobotModelProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="w-full h-full cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[2, 2, 2]} intensity={1} />
        <pointLight position={[-2, -2, -2]} intensity={0.5} color="#8B5CF6" />
        <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={isActive ? 1 : 0.5} color="#EC4899" />

        <group scale={isHovered ? 1.1 : 1}>
          <RobotHead isActive={isActive} isThinking={isThinking} />
          <RobotBody isActive={isActive} />
        </group>
      </Canvas>
    </div>
  )
}
