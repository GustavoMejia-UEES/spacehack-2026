/**
 * GenericModel.tsx
 *
 * ⚙️ COMPONENTE GENÉRICO DE MODELO 3D
 *
 * Este componente abstrae la carga y animación de cualquier archivo .glb.
 * Detecta automáticamente las animaciones disponibles en el modelo y permite
 * ejecutarlas mediante el prop `action`.
 *
 * 🎯 CARACTERÍSTICAS:
 * - Carga automática de modelos .glb desde cualquier ruta
 * - Detección automática de animaciones
 * - Transiciones suaves (crossFade) entre animaciones
 * - No requiere importación manual del modelo en código
 * - Reutilizable para múltiples modelos
 *
 * 📝 CÓMO USAR:
 * ```jsx
 * <GenericModel
 *   modelPath="/models/MiModelo.glb"
 *   action="walk"    // Nombre de la animación a reproducir
 *   isAnimating={true}
 *   scale={0.5}
 *   position={[0, -0.8, 0]}
 * />
 * ```
 *
 * 🔧 PARA CAMBIAR DE MODELO:
 * 1. Convierte tu modelo Blender a .glb (File > Export > glTF 2.0)
 * 2. Coloca el archivo en /public/models/
 * 3. Cambia el prop modelPath: "/models/TuModelo.glb"
 * 4. Inspecciona en browser console qué animaciones tiene (ver log de animationNames)
 * 5. Usa esos nombres en el prop action
 *
 * ⚠️ SI EL MODELO ES MUY GRANDE:
 * - Ajusta el prop scale (ej: scale={0.3} para reducir)
 * - O edita el modelo en Blender: Select All > Scale > 0.5 en Edit Mode
 *
 * 📊 PROPIEDADES:
 * - modelPath: string - Ruta del archivo .glb (/public/models/*)
 * - action?: string - Nombre de la animación a ejecutar
 * - isAnimating?: boolean - Si true, ejecuta la animación; si false, vuelve a idle
 * - scale?: number - Factor de escala (por defecto 1)
 * - position?: [number, number, number] - Posición XYZ
 * - [key]: any - Cualquier otra prop de React Three Fiber
 */

import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import type { Group } from 'three'

interface GenericModelProps extends React.PropsWithChildren {
  /** Ruta del archivo .glb relativa a /public */
  modelPath: string
  /** Nombre de la animación a ejecutar */
  action?: string
  /** Si está en estado de animación */
  isAnimating?: boolean
  /** Factor de escala (1 = tamaño original) */
  scale?: number | [number, number, number]
  /** Posición en 3D */
  position?: [number, number, number]
  /** Callback cuando las animaciones se cargan */
  onAnimationsLoaded?: (animationNames: string[]) => void
  /** Props adicionales de Three.js */
  [key: string]: any
}

/**
 * Componente genérico que carga y anima cualquier modelo .glb
 * Automáticamente detecta animaciones y ejecuta crossfades suaves
 */
export function GenericModel({
  modelPath,
  action,
  isAnimating = false,
  scale = 1,
  position = [0, 0, 0],
  onAnimationsLoaded,
  ...props
}: GenericModelProps) {
  const group = useRef<Group>(null)

  // 1. CARGAR MODELO Y DETECTAR ANIMACIONES
  const { scene, animations } = useGLTF(modelPath) as any
  const { actions, names: animationNames } = useAnimations(
    animations,
    group as any,
  )

  // Log de animaciones disponibles (útil para debugging)
  useEffect(() => {
    const availableAnimations = animationNames || []
    console.log(
      `📦 [${modelPath}] Animaciones detectadas:`,
      availableAnimations,
    )
    if (onAnimationsLoaded) {
      onAnimationsLoaded(availableAnimations)
    }
  }, [modelPath, animationNames, onAnimationsLoaded])

  // 2. LÓGICA DE CONTROL DE ANIMACIONES
  useEffect(() => {
    if (!actions || animationNames.length === 0) return

    const CROSSFADE_DURATION = 0.5
    const idleAnimation = animationNames[0] // Primera animación = idle por defecto

    try {
      // CASO 1: Se solicitó una animación específica Y estamos animando
      if (action && animationNames.includes(action) && isAnimating) {
        const targetAction = actions[action]

        if (targetAction) {
          // Transición suave desde cualquier animación que esté en progreso
          Object.entries(actions).forEach(
            ([name, currentAction]: [string, any]) => {
              if (
                name !== action &&
                currentAction &&
                typeof currentAction.isRunning === 'function' &&
                currentAction.isRunning()
              ) {
                targetAction.reset()
                currentAction.crossFadeTo(
                  targetAction,
                  CROSSFADE_DURATION,
                  true,
                )
                targetAction.play()
              }
            },
          )

          // Si ninguna estaba en progreso, solo hacer play
          const anyRunning = Object.values(actions).some(
            (a: any) => typeof a?.isRunning === 'function' && a.isRunning(),
          )

          if (!anyRunning) {
            targetAction.reset()
            targetAction.play()
          }

          console.log(`▶️ Animación: "${action}"`)
        }
      }
      // CASO 2: No estamos animando → volver a idle
      else if (!isAnimating && idleAnimation && actions[idleAnimation]) {
        const idleAction = actions[idleAnimation]

        // Transición suave a idle
        Object.entries(actions).forEach(
          ([name, currentAction]: [string, any]) => {
            if (
              name !== idleAnimation &&
              currentAction &&
              typeof currentAction.isRunning === 'function' &&
              currentAction.isRunning()
            ) {
              currentAction.crossFadeTo(idleAction, CROSSFADE_DURATION, true)
              idleAction.play()
            }
          },
        )

        // Asegurar que idle esté siempre playing
        const anyRunning = Object.values(actions).some(
          (a: any) => typeof a?.isRunning === 'function' && a.isRunning(),
        )

        if (!anyRunning) {
          idleAction.reset()
          idleAction.play()
        }

        console.log(`▶️ Volviendo a: "${idleAnimation}"`)
      }
    } catch (error) {
      console.error(`❌ Error controlando animaciones en ${modelPath}:`, error)
    }
  }, [action, isAnimating, actions, animationNames])

  // 3. PRECARGAR MODELO PARA MEJOR UX
  useEffect(() => {
    useGLTF.preload(modelPath)
  }, [modelPath])

  // 4. RENDERIZAR
  return (
    <group
      ref={group}
      scale={scale}
      position={position}
      {...props}
      dispose={null}
    >
      <primitive object={scene} />
    </group>
  )
}

/**
 * Precargar un modelo para evitar delays
 * Uso: GenericModel.preload("/models/MiModelo.glb")
 */
GenericModel.preload = (path: string) => {
  useGLTF.preload(path)
}
