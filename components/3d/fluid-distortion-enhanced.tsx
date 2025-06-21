"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Plane } from "@react-three/drei"
import * as THREE from "three"

// Enhanced vertex shader with realistic fluid physics
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uMouseVelocity;
  uniform float uViscosity;
  uniform float uTurbulence;
  uniform float uSurfaceTension;
  uniform float uFlowSpeed;
  uniform float uWaveAmplitude;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying float vDistortion;
  varying vec3 vNormal;
  varying float vVelocity;
  
  // Improved noise functions for fluid simulation
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // Fluid velocity field simulation
  vec2 getVelocityField(vec2 pos, float time) {
    float noise1 = snoise(pos * 3.0 + time * 0.1);
    float noise2 = snoise(pos * 2.0 + time * 0.15 + 100.0);
    
    vec2 velocity = vec2(
      cos(noise1 * 6.28318) * noise2,
      sin(noise1 * 6.28318) * noise2
    );
    
    return velocity * uFlowSpeed;
  }
  
  // Surface tension simulation
  float getSurfaceTension(vec2 pos, float time) {
    float dist = length(pos - 0.5);
    return exp(-dist * uSurfaceTension) * sin(time * 2.0 + dist * 10.0) * 0.1;
  }
  
  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    vec2 normalizedPos = (pos.xy + 1.0) * 0.5; // Convert to 0-1 range
    
    // Calculate mouse influence with realistic fluid dynamics
    vec2 mouseDir = uMouse - uPrevMouse;
    float mouseSpeed = length(mouseDir) * uMouseVelocity;
    vec2 mouseForce = normalize(mouseDir + 0.001) * mouseSpeed;
    
    float mouseDistance = distance(normalizedPos, uMouse);
    float mouseInfluence = exp(-mouseDistance * 8.0) * smoothstep(0.5, 0.0, mouseDistance);
    
    // Realistic ripple propagation
    float rippleSpeed = 2.0;
    float rippleFreq = 12.0;
    float ripple = sin(mouseDistance * rippleFreq - uTime * rippleSpeed) * 
                   exp(-mouseDistance * 3.0) * mouseSpeed;
    
    // Fluid velocity field
    vec2 velocity = getVelocityField(normalizedPos, uTime);
    vVelocity = length(velocity);
    
    // Turbulence based on velocity
    float turbulence = snoise(normalizedPos * 8.0 + velocity * uTime) * uTurbulence;
    turbulence += snoise(normalizedPos * 16.0 + velocity * uTime * 0.5) * uTurbulence * 0.5;
    
    // Surface tension effects
    float surfaceTension = getSurfaceTension(normalizedPos, uTime);
    
    // Viscosity damping
    float viscosityDamping = 1.0 - uViscosity * 0.5;
    
    // Combine all fluid effects
    float fluidHeight = 0.0;
    
    // Mouse interaction with realistic fluid response
    fluidHeight += mouseInfluence * (ripple + mouseSpeed * 0.3) * viscosityDamping;
    
    // Ambient fluid motion
    fluidHeight += (turbulence + surfaceTension) * uWaveAmplitude * viscosityDamping;
    
    // Add directional flow based on mouse movement
    vec2 flowOffset = mouseForce * mouseInfluence * 0.02;
    pos.xy += flowOffset;
    
    // Apply height displacement
    pos.z += fluidHeight;
    
    // Secondary wave patterns for more realistic motion
    float wave1 = sin(normalizedPos.x * 8.0 + uTime * 0.8 + velocity.x) * 0.02;
    float wave2 = cos(normalizedPos.y * 6.0 + uTime * 0.6 + velocity.y) * 0.015;
    pos.z += (wave1 + wave2) * uWaveAmplitude * viscosityDamping;
    
    vDistortion = fluidHeight;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Enhanced fragment shader with realistic fluid rendering
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseVelocity;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uAccentColor;
  uniform float uOpacity;
  uniform float uReflectivity;
  uniform float uRefraction;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying float vDistortion;
  varying vec3 vNormal;
  varying float vVelocity;
  
  // Realistic fluid color mixing
  vec3 getFluidColor(vec2 uv, float distortion, float velocity) {
    // Base color flow
    vec2 flowUv = uv + vec2(
      sin(uTime * 0.2 + uv.y * 4.0) * 0.1,
      cos(uTime * 0.15 + uv.x * 3.0) * 0.08
    );
    
    // Velocity-based color shifts
    float velocityInfluence = smoothstep(0.0, 0.5, velocity);
    
    // Mouse interaction colors
    float mouseDistance = distance(uv, uMouse);
    float mouseGlow = exp(-mouseDistance * 6.0) * uMouseVelocity;
    
    // Multi-layer color mixing
    float colorMix1 = sin(flowUv.x * 6.28318 + uTime * 0.3) * 0.5 + 0.5;
    float colorMix2 = cos(flowUv.y * 6.28318 + uTime * 0.25) * 0.5 + 0.5;
    
    // Base fluid color
    vec3 color = mix(uColor1, uColor2, colorMix1);
    color = mix(color, uColor3, colorMix2 * 0.6);
    
    // Add accent color based on velocity and mouse interaction
    color = mix(color, uAccentColor, velocityInfluence * 0.4 + mouseGlow * 0.6);
    
    // Realistic fluid brightness based on distortion (simulating light refraction)
    float brightness = 1.0 + abs(distortion) * uReflectivity + mouseGlow * 0.8;
    color *= brightness;
    
    // Add subtle iridescence
    float iridescence = sin(distortion * 20.0 + uTime) * 0.1 + 0.9;
    color *= iridescence;
    
    return color;
  }
  
  void main() {
    vec3 color = getFluidColor(vUv, vDistortion, vVelocity);
    
    // Realistic edge fading with fluid-like transitions
    vec2 edgeDistance = min(vUv, 1.0 - vUv);
    float edgeFade = smoothstep(0.0, 0.2, min(edgeDistance.x, edgeDistance.y));
    
    // Dynamic opacity based on fluid activity
    float dynamicOpacity = uOpacity * (1.0 + abs(vDistortion) * 0.5);
    dynamicOpacity *= edgeFade;
    
    // Add subtle transparency variations for depth
    float depthVariation = 1.0 + vDistortion * 0.3;
    dynamicOpacity *= depthVariation;
    
    gl_FragColor = vec4(color, dynamicOpacity);
  }
`

interface FluidMaterialProps {
  mousePosition: THREE.Vector2
  prevMousePosition: THREE.Vector2
  mouseVelocity: number
  isHovering: boolean
  performanceLevel: number
}

function FluidMaterial({
  mousePosition,
  prevMousePosition,
  mouseVelocity,
  isHovering,
  performanceLevel,
}: FluidMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Performance-adaptive uniforms
  const uniforms = useMemo(() => {
    const baseQuality = Math.max(0.3, performanceLevel)

    return {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: 0 },
      uViscosity: { value: 0.3 * baseQuality },
      uTurbulence: { value: 0.15 * baseQuality },
      uSurfaceTension: { value: 2.0 },
      uFlowSpeed: { value: 0.2 * baseQuality },
      uWaveAmplitude: { value: 0.4 * baseQuality },
      uColor1: { value: new THREE.Color(0x8b5cf6) },
      uColor2: { value: new THREE.Color(0xa855f7) },
      uColor3: { value: new THREE.Color(0xec4899) },
      uAccentColor: { value: new THREE.Color(0x06b6d4) },
      uOpacity: { value: 0.2 * baseQuality },
      uReflectivity: { value: 1.5 },
      uRefraction: { value: 0.1 },
      uResolution: { value: new THREE.Vector2(1024, 512) },
    }
  }, [performanceLevel])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime

      // Smooth mouse position updates
      materialRef.current.uniforms.uPrevMouse.value.copy(materialRef.current.uniforms.uMouse.value)
      materialRef.current.uniforms.uMouse.value.lerp(mousePosition, 0.1)

      // Calculate and smooth mouse velocity
      const targetVelocity = isHovering ? Math.min(mouseVelocity * 2.0, 1.0) : 0
      materialRef.current.uniforms.uMouseVelocity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouseVelocity.value,
        targetVelocity,
        0.05,
      )

      // Dynamic quality adjustment
      const targetOpacity = isHovering ? 0.35 : 0.2
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value,
        targetOpacity * Math.max(0.3, performanceLevel),
        0.02,
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

function FluidPlane({
  mousePosition,
  prevMousePosition,
  mouseVelocity,
  isHovering,
  performanceLevel,
}: FluidMaterialProps) {
  // Adaptive geometry resolution based on performance
  const resolution = useMemo(() => {
    if (performanceLevel < 0.5) return [24, 12] // Low quality
    if (performanceLevel < 0.8) return [32, 16] // Medium quality
    return [48, 24] // High quality
  }, [performanceLevel])

  return (
    <Plane args={[4, 2, resolution[0], resolution[1]]} position={[0, 0, -0.5]}>
      <FluidMaterial
        mousePosition={mousePosition}
        prevMousePosition={prevMousePosition}
        mouseVelocity={mouseVelocity}
        isHovering={isHovering}
        performanceLevel={performanceLevel}
      />
    </Plane>
  )
}

interface FluidDistortionEnhancedProps {
  mousePosition: THREE.Vector2
  prevMousePosition: THREE.Vector2
  mouseVelocity: number
  isHovering: boolean
  performanceLevel: number
  className?: string
}

export default function FluidDistortionEnhanced({
  mousePosition,
  prevMousePosition,
  mouseVelocity,
  isHovering,
  performanceLevel,
  className = "",
}: FluidDistortionEnhancedProps) {
  // Performance-adaptive canvas settings
  const canvasSettings = useMemo(() => {
    const dpr = performanceLevel > 0.7 ? [1, 2] : [1, 1.5]
    const antialias = performanceLevel > 0.8

    return {
      camera: { position: [0, 0, 2] as [number, number, number], fov: 50 },
      gl: {
        antialias,
        alpha: true,
        powerPreference: "high-performance" as const,
        stencil: false,
        depth: false,
        preserveDrawingBuffer: false,
      },
      dpr,
      performance: { min: 0.5 },
      frameloop: performanceLevel > 0.6 ? ("always" as const) : ("demand" as const),
    }
  }, [performanceLevel])

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas {...canvasSettings}>
        <FluidPlane
          mousePosition={mousePosition}
          prevMousePosition={prevMousePosition}
          mouseVelocity={mouseVelocity}
          isHovering={isHovering}
          performanceLevel={performanceLevel}
        />
      </Canvas>
    </div>
  )
}
