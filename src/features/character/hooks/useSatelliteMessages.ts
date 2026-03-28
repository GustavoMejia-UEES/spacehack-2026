/**
 * useSatelliteMessages.ts
 *
 * 📡 HOOK DE MENSAJES DE SATÉLITE (SIN AUDIO)
 *
 * Gestiona la visualización de mensajes en la burbuja de chat.
 * - Mantiene un historial de mensajes
 * - Muestra mensajes automáticamente cada 12s (con mensajes mock)
 * - Acepta mensajes externos (ej: desde N8N API, Socket.io, etc.)
 *
 * 🎯 CARACTERÍSTICAS:
 * - Mock de mensajes incorporados (satelital theme)
 * - Soporte para mensajes externos dinámicos
 * - Control manual de dismissal
 * - Sin lógica de audio (puro estado de UI)
 * - Fácil de extender para agregar socket listeners
 *
 * 📝 USO:
 * ```jsx
 * const { activeMessage, isAnimating, dismissMessage } = useSatelliteMessages(true)
 *
 * // Con mensaje externo (ej: N8N response)
 * const { activeMessage } = useSatelliteMessages(true, externalMessage)
 * ```
 *
 * 🔧 PARA CAMBIAR MENSAJES MOCK:
 * - Edita MOCK_MESSAGES (línea ~30)
 * - title: "[SAT-ALERT]", "[SAT-WARNING]", "[SAT-INFO]"
 * - type: "alert" | "warning" | "info" (define colores)
 * - content: Texto del mensaje
 * - Remover audioUrl (ya no se usa)
 *
 * 🚀 PARA CONECTAR A API EXTERNA:
 * Un hook refactorizado que suma mensajes de N8N:
 * ```jsx
 * const [externalMsg, setExternalMsg] = useState<SatelliteMessage | null>(null)
 *
 * // listeners.on('n8n:message', (text) => {
 * //   setExternalMsg({ type: 'info', content: text, ... })
 * // })
 *
 * const msg = useSatelliteMessages(false, externalMsg)  // disabled mock
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export interface SatelliteMessage {
  id: string
  timestamp: number
  type: 'alert' | 'info' | 'warning'
  title: string
  content: string
  icon: string
}

/**
 * MENSAJES MOCK - Tema satelital/transporte marítimo
 * ⚠️ Edita estos para cambiar los mensajes por defecto
 */
const MOCK_MESSAGES: SatelliteMessage[] = [
  {
    id: 'sat-001',
    timestamp: Date.now(),
    type: 'alert',
    title: '[SAT-ALERT] Congestión Detectada',
    content:
      'Coo! Coo! 🐦 Detectada congestión en Canal de Panamá. Barco "Evergreen" desviado. Pérdida estimada: 50 ton CO2 extra. ¿Optimizar ruta terrestre?',
    icon: '🛰️',
  },
  {
    id: 'sat-002',
    timestamp: Date.now() + 15000,
    type: 'warning',
    title: '[SAT-WARNING] Emisiones Altas',
    content:
      'Coo! 📊 Sector portuario de Rotterdam registra +15% emisiones. Sugerencia: Redirigir carga a puerto verde certificado.',
    icon: '⚠️',
  },
  {
    id: 'sat-003',
    timestamp: Date.now() + 30000,
    type: 'info',
    title: '[SAT-INFO] Ruta Optimizada',
    content:
      '✨ Coo! Ruta verde identificada: Shanghai → Singapur → Puerto Said. Ahorro: 120 ton CO2 vs ruta tradicional.',
    icon: '✅',
  },
]

/**
 * Hook que gestiona el estado de mensajes de satélite
 * @param enabled - Si true, activa el envío automático de mock messages cada 12s
 * @param externalMessage - Mensaje externo a mostrar (sobrescribe el mock actual)
 */
export function useSatelliteMessages(
  enabled = true,
  externalMessage?: SatelliteMessage | null,
) {
  const [messages, setMessages] = useState<SatelliteMessage[]>([])
  const [activeMessage, setActiveMessage] = useState<SatelliteMessage | null>(
    null,
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messageIndexRef = useRef(0)

  // 1. SI LLEGA UN MENSAJE EXTERNO (N8N, Socket, etc), USARLO
  useEffect(() => {
    if (externalMessage) {
      console.log('📡 Mensaje externo recibido:', externalMessage.title)
      setActiveMessage(externalMessage)
      setIsAnimating(true)
    }
  }, [externalMessage])

  // 2. ENVÍO AUTOMÁTICO DE MOCK MESSAGES cada 12 segundos
  useEffect(() => {
    if (!enabled || MOCK_MESSAGES.length === 0) return

    console.log('📡 Iniciando simulador de mensajes satelitales')
    messageIndexRef.current = 0

    const interval = setInterval(() => {
      if (messageIndexRef.current < MOCK_MESSAGES.length) {
        const newMessage = MOCK_MESSAGES[messageIndexRef.current]
        console.log(
          `📡 Mensaje #${messageIndexRef.current + 1}: ${newMessage.title}`,
        )
        setMessages((prev) => [...prev, newMessage])
        setActiveMessage(newMessage)
        setIsAnimating(true)

        messageIndexRef.current++

        // Reiniciar ciclo cuando llegamos al final
        if (messageIndexRef.current >= MOCK_MESSAGES.length) {
          messageIndexRef.current = 0
        }
      }
    }, 12000) // Nuevo mensaje cada 12 segundos

    return () => {
      console.log('📡 Limpiando simulador de mensajes')
      clearInterval(interval)
    }
  }, [enabled])

  // 3. MOSTRAR MENSAJE DURANTE 6 SEGUNDOS, LUEGO DESAPARECER
  useEffect(() => {
    if (!activeMessage) return

    // Limpiar timeout anterior
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current)
    }

    // Mantener animación activa
    setIsAnimating(true)

    // Desaparecer después de 6 segundos
    dismissTimeoutRef.current = setTimeout(() => {
      setActiveMessage(null)
      setIsAnimating(false)
    }, 6000)

    return () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current)
      }
    }
  }, [activeMessage])

  // 4. FUNCIÓN PARA CERRAR MENSAJE MANUALMENTE
  const dismissMessage = useCallback(() => {
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current)
    }
    setActiveMessage(null)
    setIsAnimating(false)
  }, [])

  return {
    messages,
    activeMessage,
    isAnimating,
    dismissMessage,
  }
}
