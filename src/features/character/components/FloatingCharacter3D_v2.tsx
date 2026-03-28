import { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, ContactShadows, Environment } from '@react-three/drei'
import { Vector3 } from 'three'
import { Fox } from '../models/Fox'
import { ChatBubble } from './ChatBubble'
import type { SatelliteMessage } from '../hooks/useSatelliteMessages'

interface FloatingCharacter3DProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  isAnimating?: boolean
  message?: SatelliteMessage | null
  onDismissMessage?: () => void
}

// Responsive size config con fov y scale ajustados
const sizeConfig = {
  sm: {
    width: 'w-40 sm:w-56 md:w-64',
    height: 'h-40 sm:h-56 md:h-64',
    fov: 40,
    scale: 0.3,
  },
  md: {
    width: 'w-56 sm:w-72 md:w-80',
    height: 'h-56 sm:h-72 md:h-80',
    fov: 35,
    scale: 0.5,
  },
  lg: {
    width: 'w-72 sm:w-96 md:w-screen/3',
    height: 'h-72 sm:h-96 md:h-screen/3',
    fov: 30,
    scale: 0.7,
  },
}

const positionConfig = {
  'bottom-right': 'bottom-2 sm:bottom-4 right-2 sm:right-4',
  'bottom-left': 'bottom-2 sm:bottom-4 left-2 sm:left-4',
  'top-right': 'top-2 sm:top-4 right-2 sm:right-4',
  'top-left': 'top-2 sm:top-4 left-2 sm:left-4',
}

/**
 * Componente que proyecta la posición de la cabeza del zorro a coordenadas de pantalla
 */
function HeadPositionTracker({
  onPositionUpdate,
}: {
  onPositionUpdate: (x: number, y: number) => void
}) {
  const { camera, gl } = useThree()

  useFrame(() => {
    // Posición de la cabeza del zorro en 3D (aproximadamente)
    const headPos = new Vector3(0, 0.5, 0)

    // Proyectar a coordenadas de pantalla
    headPos.project(camera)

    // Convertir de [-1, 1] a coordenadas de pantalla
    const screenX = (headPos.x * gl.domElement.clientWidth) / 2
    const screenY = (gl.domElement.clientHeight * (1 - headPos.y)) / 2

    onPositionUpdate(screenX, screenY)
  })

  return null
}

export function FloatingCharacter3D({
  position = 'bottom-right',
  size = 'md',
  isAnimating = false,
  message = null,
  onDismissMessage,
}: FloatingCharacter3DProps) {
  const [foxScale, setFoxScale] = useState(1)
  const [showBubble, setShowBubble] = useState(false)
  const [headScreenX, setHeadScreenX] = useState(0)
  const [headScreenY, setHeadScreenY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const config = sizeConfig[size]
  const posClass = positionConfig[position]

  // Reacción visual cuando está animando
  useEffect(() => {
    if (isAnimating) {
      console.log('🎬 isAnimating=true → mostrando burbuja')
      setFoxScale(1.1)
      setShowBubble(true)
      const timer = setTimeout(() => setFoxScale(1), 600)
      return () => clearTimeout(timer)
    } else {
      console.log('🎬 isAnimating=false → ocultando burbuja')
      setShowBubble(false)
    }
  }, [isAnimating])

  // Determinar animación a reproducir
  const animationToPlay = useMemo(() => {
    if (isAnimating) {
      return 'Action'
    }
    return undefined
  }, [isAnimating])

  const handleHeadPositionUpdate = (x: number, y: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const relativeX = x + rect.left
      const relativeY = y + rect.top
      setHeadScreenX(relativeX)
      setHeadScreenY(relativeY)
    }
  }

  return (
    <>
      {/* Canvas container */}
      <div
        ref={containerRef}
        className={`fixed ${posClass} ${config.width} ${config.height} z-40 pointer-events-none`}
      >
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: config.fov }}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
            }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
            }}
            performance={{ min: 0.3, max: 1 }}
            className="pointer-events-auto"
          >
            {/* Tracker de posición de cabeza */}
            <HeadPositionTracker onPositionUpdate={handleHeadPositionUpdate} />

            {/* Zorro flotante con animación reactiva */}
            <Float
              speed={isAnimating ? 3 : 1.5}
              rotationIntensity={0.3}
              floatIntensity={isAnimating ? 2 : 1.2}
            >
              {/* Grupo escalable del zorro */}
              <group scale={foxScale * config.scale} position={[0, -0.8, 0]}>
                <Fox
                  animationName={animationToPlay}
                  isAnimating={isAnimating}
                />
              </group>
            </Float>

            {/* Sombra de contacto optimizada */}
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.3}
              scale={4}
              blur={2}
            />

            {/* Ambiente */}
            <Environment preset="city" />

            {/* Iluminación */}
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={0.4} />
          </Canvas>
        </Suspense>
      </div>

      {/* Chat bubble - fuera del Canvas, como overlay absoluto */}
      <ChatBubble
        message={message}
        isVisible={showBubble}
        onDismiss={() => {
          setShowBubble(false)
          if (onDismissMessage) {
            onDismissMessage()
          }
        }}
        screenX={headScreenX}
        screenY={headScreenY}
      />
    </>
  )
}
