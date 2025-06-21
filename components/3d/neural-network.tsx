"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Line } from "@react-three/drei"
import type * as THREE from "three"

function NetworkNode({
  position,
  color,
  delay = 0,
}: { position: [number, number, number]; color: string; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.2
      meshRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <Sphere ref={meshRef} args={[0.1, 16, 16]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </Sphere>
  )
}

function NetworkConnections() {
  const nodes = useMemo(
    () => [
      { pos: [-2, 1, 0] as [number, number, number], color: "#8B5CF6" },
      { pos: [-2, 0, 0] as [number, number, number], color: "#8B5CF6" },
      { pos: [-2, -1, 0] as [number, number, number], color: "#8B5CF6" },
      { pos: [0, 0.5, 0] as [number, number, number], color: "#A855F7" },
      { pos: [0, -0.5, 0] as [number, number, number], color: "#A855F7" },
      { pos: [2, 0, 0] as [number, number, number], color: "#EC4899" },
    ],
    [],
  )

  const connections = useMemo(
    () => [
      [nodes[0].pos, nodes[3].pos],
      [nodes[0].pos, nodes[4].pos],
      [nodes[1].pos, nodes[3].pos],
      [nodes[1].pos, nodes[4].pos],
      [nodes[2].pos, nodes[3].pos],
      [nodes[2].pos, nodes[4].pos],
      [nodes[3].pos, nodes[5].pos],
      [nodes[4].pos, nodes[5].pos],
    ],
    [nodes],
  )

  return (
    <group>
      {/* Render connections */}
      {connections.map((connection, i) => (
        <Line key={i} points={connection} color="#8B5CF6" lineWidth={2} transparent opacity={0.4} />
      ))}

      {/* Render nodes */}
      {nodes.map((node, i) => (
        <NetworkNode key={i} position={node.pos} color={node.color} delay={i * 0.5} />
      ))}
    </group>
  )
}

export default function NeuralNetwork() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />

        <NetworkConnections />
      </Canvas>
    </div>
  )
}
