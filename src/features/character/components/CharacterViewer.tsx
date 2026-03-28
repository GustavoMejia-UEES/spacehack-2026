import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  PresentationControls,
  Float,
  ContactShadows,
  Environment,
} from '@react-three/drei'
import { Fox } from '../models/Fox'

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-white text-center">
        <div className="animate-spin mb-4">⏳</div>
        <p>Cargando asistente...</p>
      </div>
    </div>
  )
}

interface CharacterViewerProps {
  isAnimating?: boolean
}

export function CharacterViewer({ isAnimating = false }: CharacterViewerProps) {
  const [foxScale, setFoxScale] = useState(1)

  // Reacción visual cuando llega un mensaje (pulse animation)
  useEffect(() => {
    if (isAnimating) {
      // Pequeño salto/escala
      setFoxScale(1.1)
      const timer = setTimeout(() => setFoxScale(1), 400)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return (
    <div className="w-full h-full">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 1, 4], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          performance={{ min: 0.5, max: 1 }}
        >
          <PresentationControls
            speed={1.5}
            rotation={[0.13, Math.PI, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Float
              speed={isAnimating ? 2 : 1.5}
              rotationIntensity={isAnimating ? 2 : 1}
              floatIntensity={isAnimating ? 3 : 2}
            >
              <group scale={foxScale}>
                <Fox />
              </group>
            </Float>
          </PresentationControls>

          <ContactShadows
            position={[0, -1.5, 0]}
            scale={10}
            blur={2.5}
            far={4}
          />
          <Environment preset="night" />

          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        </Canvas>
      </Suspense>
    </div>
  )
}
