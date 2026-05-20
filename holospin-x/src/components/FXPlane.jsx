import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FXPlane({ audioLevel }) {
  const mesh = useRef()

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = state.clock.elapsedTime
      mesh.current.material.uniforms.uAudio.value = audioLevel
    }
  })

  const material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uAudio: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uAudio;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        float c = sin(uv.x * 20.0 + uTime) + sin(uv.y * 20.0 + uTime);
        vec3 color = vec3(
          0.5 + 0.5 * sin(uTime + c),
          0.5 + 0.5 * sin(uTime + c + 2.0),
          0.5 + 0.5 * sin(uTime + c + 4.0)
        );
        color *= 1.0 + uAudio;
        gl_FragColor = vec4(color, 0.2);
      }
    `
  })

  return (
    <mesh ref={mesh} position={[0, 0, -5]}>
      <planeGeometry args={[40, 40]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
