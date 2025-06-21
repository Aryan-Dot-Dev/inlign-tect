"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Plane } from "@react-three/drei"
import * as THREE from "three"

// Enhanced vertex shader with more pronounced distortion
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uWaveStrength;
  uniform float uDistortionRadius;
  uniform float uRippleStrength;
  
  varying vec2 vUv;
  varying float vDistortion;
  varying vec3 vNormal;
  
  // Noise function for organic distortion
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    
    // Enhanced mouse-based distortion with ripple effect
    float mouseDistance = distance(uv, uMouse);
    float mouseInfluence = smoothstep(uDistortionRadius, 0.0, mouseDistance);
    
    // Create ripple effect
    float ripple = sin(mouseDistance * 15.0 - uTime * 3.0) * 0.5 + 0.5;
    float mouseEffect = mouseInfluence * uMouseStrength * (1.0 + ripple * uRippleStrength);
    
    // Enhanced wave distortion with multiple frequencies
    float wave1 = sin(pos.x * 6.0 + uTime * 0.8) * 0.15;
    float wave2 = cos(pos.y * 4.0 + uTime * 0.6) * 0.12;
    float wave3 = sin((pos.x + pos.y) * 3.0 + uTime * 0.4) * 0.08;
    
    // Add noise-based organic movement
    float noiseValue = smoothNoise(uv * 8.0 + uTime * 0.1) * 0.1;
    
    float waveEffect = (wave1 + wave2 + wave3 + noiseValue) * uWaveStrength;
    
    // Combine effects with enhanced intensity
    float totalDistortion = mouseEffect + waveEffect;
    
    // Add secondary distortion for more complex movement
    float secondaryDistortion = sin(pos.x * 2.0 + uTime * 0.3) * cos(pos.y * 2.0 + uTime * 0.2) * 0.05;
    totalDistortion += secondaryDistortion * uWaveStrength;
    
    pos.z += totalDistortion;
    
    // Add slight XY distortion for more fluid movement
    pos.x += sin(uTime * 0.5 + uv.y * 3.14159) * 0.02 * uWaveStrength;
    pos.y += cos(uTime * 0.4 + uv.x * 3.14159) * 0.015 * uWaveStrength;
    
    vDistortion = totalDistortion;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Enhanced fragment shader with more vibrant colors
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uOpacity;
  uniform vec2 uMouse;
  uniform float uColorIntensity;
  
  varying vec2 vUv;
  varying float vDistortion;
  varying vec3 vNormal;
  
  void main() {
    // Enhanced flowing gradient with more complexity
    vec2 flowUv = vUv + vec2(
      sin(uTime * 0.3 + vUv.y * 6.28318) * 0.15,
      cos(uTime * 0.25 + vUv.x * 6.28318) * 0.12
    );
    
    // Mouse influence on colors with enhanced radius
    float mouseDistance = distance(vUv, uMouse);
    float mouseInfluence = 1.0 - smoothstep(0.0, 0.7, mouseDistance);
    float mouseGlow = exp(-mouseDistance * 8.0) * 0.8;
    
    // Multi-layered color mixing
    float colorMix1 = sin(flowUv.x * 3.14159 * 2.0 + uTime * 0.4) * 0.5 + 0.5;
    float colorMix2 = cos(flowUv.y * 3.14159 * 1.5 + uTime * 0.3) * 0.5 + 0.5;
    float colorMix3 = sin((flowUv.x + flowUv.y) * 3.14159 + uTime * 0.2) * 0.5 + 0.5;
    
    // Base color mixing
    vec3 color = mix(uColor1, uColor2, colorMix1);
    color = mix(color, uColor3, colorMix2 * 0.7);
    color = mix(color, uColor4, colorMix3 * mouseInfluence * 0.5);
    
    // Enhanced mouse interaction colors
    color += uColor3 * mouseGlow * uColorIntensity;
    color += uColor4 * mouseInfluence * 0.3 * uColorIntensity;
    
    // Distortion-based brightness and color shifts
    float brightness = 1.0 + vDistortion * 1.2 + mouseGlow * 0.8;
    color *= brightness;
    
    // Add color saturation based on distortion
    float saturation = 1.0 + abs(vDistortion) * 0.5;
    color = mix(vec3(dot(color, vec3(0.299, 0.587, 0.114))), color, saturation);
    
    // Enhanced edge fading with smoother transitions
    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * 
                     smoothstep(0.0, 0.15, vUv.y) * 
                     smoothstep(0.0, 0.15, 1.0 - vUv.x) * 
                     smoothstep(0.0, 0.15, 1.0 - vUv.y);
    
    // Dynamic opacity based on activity
    float dynamicOpacity = uOpacity * (1.0 + mouseInfluence * 0.4);
    
    gl_FragColor = vec4(color, dynamicOpacity * edgeFade);
  }
`

interface FluidMaterialProps {
  mousePosition: THREE.Vector2
  isHovering: boolean
}

function FluidMaterial({ mousePosition, isHovering }: FluidMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: 0.8 },
      uWaveStrength: { value: 0.25 },
      uDistortionRadius: { value: 0.4 },
      uRippleStrength: { value: 0.6 },
      uColor1: { value: new THREE.Color(0x8b5cf6) },
      uColor2: { value: new THREE.Color(0xa855f7) },
      uColor3: { value: new THREE.Color(0xec4899) },
      uColor4: { value: new THREE.Color(0x06b6d4) },
      uOpacity: { value: 0.25 },
      uColorIntensity: { value: 1.2 },
    }),
    [],
  )

  // Use useFrame hook properly within Canvas context
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime

      // Copy mouse position values to avoid reference issues
      materialRef.current.uniforms.uMouse.value.set(mousePosition.x, mousePosition.y)

      // Dynamic intensity based on hover state
      const targetMouseStrength = isHovering ? 1.2 : 0.8
      const targetOpacity = isHovering ? 0.35 : 0.25

      // Smooth transitions
      materialRef.current.uniforms.uMouseStrength.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouseStrength.value,
        targetMouseStrength,
        0.05,
      )

      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value,
        targetOpacity,
        0.03,
      )
    }
  })

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
    />
  )
}

function FluidPlane({ mousePosition, isHovering }: FluidMaterialProps) {
  return (
    <Plane args={[4, 2, 48, 24]} position={[0, 0, -0.5]}>
      <FluidMaterial mousePosition={mousePosition} isHovering={isHovering} />
    </Plane>
  )
}

interface FluidDistortionProps {
  mousePosition: THREE.Vector2
  isHovering: boolean
  className?: string
}

export default function FluidDistortion({ mousePosition, isHovering, className = "" }: FluidDistortionProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.8 }}
      >
        <FluidPlane mousePosition={mousePosition} isHovering={isHovering} />
      </Canvas>
    </div>
  )
}
