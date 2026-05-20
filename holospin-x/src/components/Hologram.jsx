import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Hologram({ audioLevel }) {
  const ref = useRef()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += 0.03
      const scale = 1 + (audioLevel * 0.2)
      ref.current.scale.set(scale, scale, scale)
    }
  })

  const leds = []

  for (let i = 0; i < 200; i++) {
    const angle = (i / 200) * Math.PI * 2
    const radius = 2 + Math.sin(i) * 0.5
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    leds.push(
      <mesh key={i} position={[x, y, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={`hsl(${i * 5},100%,60%)`}
          emissive={`hsl(${i * 5},100%,60%)`}
          emissiveIntensity={3 + audioLevel * 10}
        />
      </mesh>
    )
  }

  return (
    <group ref={ref}>
      {leds}
    </group>
  )
}
