"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"

function AnimatedSphere() {
  return (
    <Sphere args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#8B5CF6"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.4}
        transparent
        opacity={0.8}
      />
    </Sphere>
  )
}

function FloatingRings() {
  return (
    <group>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]} position={[0, 0, 0]}>
          <torusGeometry args={[2 + i * 0.5, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={i === 0 ? "#8B5CF6" : i === 1 ? "#A855F7" : "#EC4899"}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />

        <Suspense fallback={null}>
          <AnimatedSphere />
          <FloatingRings />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
