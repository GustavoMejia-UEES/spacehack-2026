/**
 * FloatingCharacter3D.tsx
 *
 * 🦊 COMPONENTE 3D FLOTANTE STANDALONE
 *
 * Renderiza un modelo 3D flotante con animaciones reactivas y burbuja de chat.
 * Diseñado para ser portable y reutilizable en cualquier proyecto React/Vite.
 *
 * 🎯 CARACTERÍSTICAS PRINCIPALES:
 * - Modelo configurable mediante prop modelPath
 * - Responsive design (mobile-first con Tailwind)
 * - Burbuja de chat con overlay absoluto
 * - Animaciones suaves con crossfade automático
 * - Posicionamiento flexible (4 esquinas)
 * - Sombra de contacto y ambiente automático
 * - Sin lógica de audio (puro visual reactivo)
 *
 * 📝 USO BÁSICO:
 * ```jsx
 * <FloatingCharacter3D
 *   modelPath="/models/Fox.glb"
 *   size="md"
 *   position="bottom-right"
 *   message={chatMessage}
 *   isAnimating={isAnimating}
 * />
 * ```
 *
 * 🎨 PARA AJUSTAR POSICIÓN INICIAL:
 * - Modifica positionConfig (línea ~47)
 * - Usa Tailwind: bottom-2 = 0.5rem en móvil, sm:bottom-4 = 1rem en desktop
 * - Propiedades: bottom-* | top-* | left-* | right-*
 *
 * 📦 PARA CAMBIAR TAMAÑO DEL MODELO:
 * - Modifica config.scale en sizeConfig (línea ~19)
 * - O pasa scale adicional en props de GenericModel
 * - Escala 0.5 = mitad tamaño, 0.3 = muy pequeño
 *
 * 🔧 PROPIEDADES:
 * - modelPath: string - Ruta del archivo .glb (/public/models/*)
 * - position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
 * - size?: 'sm' | 'md' | 'lg'
 * - isAnimating?: boolean - Activa/desactiva animación
 * - message?: SatelliteMessage | null - Mensaje a mostrar
 * - onDismissMessage?: () => void - Callback al cerrar mensaje
 */

import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, ContactShadows, Environment } from '@react-three/drei'
import { Vector3 } from 'three'
import { GenericModel } from './GenericModel'
import { ChatBubble } from './ChatBubble'
import type { SatelliteMessage } from '../hooks/useSatelliteMessages'

interface FloatingCharacter3DProps {
  /** Ruta del modelo .glb (ej: "/models/Fox.glb") */
  modelPath: string
  /** Posición en pantalla (esquinas) */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Tamaño del canvas: sm (pequeño), md (medio), lg (grande) */
  size?: 'sm' | 'md' | 'lg'
  /** Estado de animación del personaje */
  isAnimating?: boolean
  /** Mensaje a mostrar en la burbuja */
  message?: SatelliteMessage | null
  /** Nombre de la animación a ejecutar */
  animationAction?: string
  /** Callback cuando se cierra el mensaje */
  onDismissMessage?: () => void
}

/**
 * CONFIGURACIÓN DE TAMAÑOS
 * ⚠️ Para cambiar el tamaño base del modelo aquí, modifica la propiedad scale
 * Ejemplo: sm: { scale: 0.3 } significa 30% del tamaño original
 */
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
    width: 'w-72 sm:w-96 md:w-[33vw]',
    height: 'h-72 sm:h-96 md:h-[33vh]',
    fov: 30,
    scale: 0.7,
  },
}

/**
 * CONFIGURACIÓN DE POSICIÓN
 * sm: = móvil (< 640px)
 * sm:, md: = desktop responsive
 * bottom-2 = 0.5rem, bottom-4 = 1rem, etc.
 */
const positionConfig = {
  'bottom-right': 'bottom-2 sm:bottom-4 right-2 sm:right-4',
  'bottom-left': 'bottom-2 sm:bottom-4 left-2 sm:left-4',
  'top-right': 'top-2 sm:top-4 right-2 sm:right-4',
  'top-left': 'top-2 sm:top-4 left-2 sm:left-4',
}

/**
 * Componente que rastrea la posición 3D de la cabeza
 * y la proyecta a coordenadas 2D en pantalla para posicionar
 * la burbuja de chat correctamente
 */
function HeadPositionTracker({
  onPositionUpdate,
}: {
  onPositionUpdate: (x: number, y: number) => void
}) {
  const { camera, gl } = useThree()

  useFrame(() => {
    // Aproximadamente donde está la cabeza del modelo
    const headPos = new Vector3(0, 0.5, 0)

    // Proyectar coordenadas 3D a pantalla 2D
    headPos.project(camera)

    // Convertir de rango [-1, 1] a píxeles de pantalla
    const screenX = (headPos.x * gl.domElement.clientWidth) / 2
    const screenY = (gl.domElement.clientHeight * (1 - headPos.y)) / 2

    onPositionUpdate(screenX, screenY)
  })

  return null
}

/**
 * Componente principal: FloatingCharacter3D
 * Renderiza un modelo 3D con animaciones y burbuja de chat
 */
export function FloatingCharacter3D({
  modelPath,
  position = 'bottom-right',
  size = 'md',
  isAnimating = false,
  message = null,
  animationAction = 'Action',
  onDismissMessage,
}: FloatingCharacter3DProps) {
  const [foxScale, setFoxScale] = useState(1)
  const [showBubble, setShowBubble] = useState(false)
  const [headScreenX, setHeadScreenX] = useState(0)
  const [headScreenY, setHeadScreenY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const config = sizeConfig[size]
  const posClass = positionConfig[position]

  // 1. Reacción visual cuando inicia animación
  useEffect(() => {
    if (isAnimating) {
      setFoxScale(1.1) // Pequeño bounce
      setShowBubble(true)
      const timer = setTimeout(() => setFoxScale(1), 600) // Volver a escala normal
      return () => clearTimeout(timer)
    } else {
      setShowBubble(false)
    }
  }, [isAnimating])

  // 2. Actualizar posición de cabeza proyectada
  const handleHeadPositionUpdate = (x: number, y: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setHeadScreenX(x + rect.left)
      setHeadScreenY(y + rect.top)
    }
  }

  return (
    <>
      {/* 3D CANVAS CONTAINER */}
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
            {/* Tracker de posición de cabeza para burbuja */}
            <HeadPositionTracker onPositionUpdate={handleHeadPositionUpdate} />

            {/* MODELO 3D FLOTANTE CON ANIMACIÓN REACTIVA */}
            <Float
              speed={isAnimating ? 3 : 1.5}
              rotationIntensity={0.3}
              floatIntensity={isAnimating ? 2 : 1.2}
            >
              <group scale={foxScale * config.scale} position={[0, -0.8, 0]}>
                <GenericModel
                  modelPath={modelPath}
                  action={isAnimating ? animationAction : undefined}
                  isAnimating={isAnimating}
                />
              </group>
            </Float>

            {/* SOMBRA DE CONTACTO */}
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.3}
              scale={4}
              blur={2}
            />

            {/* AMBIENTE Y ILUMINACIÓN */}
            <Environment preset="city" />
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={0.4} />
          </Canvas>
        </Suspense>
      </div>

      {/* BURBUJA DE CHAT - OVERLAY FIJO */}
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
