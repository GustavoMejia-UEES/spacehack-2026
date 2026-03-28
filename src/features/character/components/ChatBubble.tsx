/**
 * ChatBubble.tsx
 *
 * 💬 BURBUJA DE CHAT STANDALONE (MOBILE-FIRST)
 *
 * Componente overlay que muestra mensajes con colores según tipo.
 * Diseñado mobile-first: en móvil se centra arriba, en desktop se posiciona
 * cerca de la cabeza del personaje 3D.
 *
 * 🎯 CARACTERÍSTICAS:
 * - Responsive móvil-first
 * - Colores según tipo: alert, warning, info, default
 * - Animación de escala al aparecer
 * - Indicador LIVE pulsante
 * - Botón cerrar en desktop
 * - Pointer visual apuntando cabeza (solo desktop)
 *
 * 📝 USO:
 * ```jsx
 * <ChatBubble
 *   message={message}
 *   isVisible={true}
 *   onDismiss={() => setMessage(null)}
 *   screenX={100}  // Posición de cabeza (desktop)
 *   screenY={50}
 * />
 * ```
 *
 * 🎨 PARA CAMBIAR COLORES:
 * - Edita getBgColor() (línea ~55)
 * - Usa rgba(R, G, B, alpha) para color + transparencia
 * - Border es el color del borde de 2px
 */

import type { SatelliteMessage } from '../hooks/useSatelliteMessages'

interface ChatBubbleProps {
  /** Mensaje a mostrar (null esconde el bubble) */
  message: SatelliteMessage | null
  /** Si es visible */
  isVisible: boolean
  /** Callback al cerrar */
  onDismiss: () => void
  /** Posición X de la cabeza (desktop) */
  screenX?: number
  /** Posición Y de la cabeza (desktop) */
  screenY?: number
}

export function ChatBubble({
  message,
  isVisible,
  onDismiss,
}: ChatBubbleProps) {
  if (!message) return null

  const getBgColor = (type: string) => {
    switch (type) {
      case 'alert':
        return { bg: 'rgba(127, 29, 29, 0.92)', border: 'rgba(248, 113, 113, 1)' }
      case 'warning':
        return { bg: 'rgba(120, 53, 15, 0.92)', border: 'rgba(251, 146, 60, 1)' }
      case 'info':
        return { bg: 'rgba(30, 58, 138, 0.92)', border: 'rgba(96, 165, 250, 1)' }
      default:
        return { bg: 'rgba(17, 24, 39, 0.92)', border: 'rgba(107, 114, 128, 1)' }
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return '🛰️'
      case 'warning': return '⚠️'
      case 'info': return '✅'
      default: return '📡'
    }
  }

  const colors = getBgColor(message.type)

  return (
    <div
      style={{
        position: 'fixed',
        // Anclado encima del personaje en la esquina inferior derecha
        bottom: 'calc(14rem + 1rem)',   // altura md mobile (14rem h-56) + gap
        right: '0.5rem',
        zIndex: 9999,
        width: 'min(280px, calc(100vw - 1rem))',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
      }}
    >
      {/* Bubble body */}
      <div
        style={{
          backgroundColor: colors.bg,
          border: `1.5px solid ${colors.border}`,
          borderRadius: '14px',
          padding: '10px 12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(14px)',
          color: 'white',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '12px',
          position: 'relative',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px' }}>{getIcon(message.type)}</span>
            <span style={{ color: 'rgb(134,239,172)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {message.title.replace(/\[SAT-\w+\]\s?/, '')}
            </span>
          </div>
          <button
            onClick={onDismiss}
            style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Message */}
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.88)', lineHeight: '1.45', fontSize: '11.5px' }}>
          {message.content}
        </p>

        {/* Footer */}
        <div style={{ marginTop: '7px', display: 'flex', alignItems: 'center', gap: '4px', color: 'rgb(74,222,128)', fontSize: '10px' }}>
          <div style={{ width: '5px', height: '5px', backgroundColor: 'rgb(74,222,128)', borderRadius: '50%', animation: 'sat-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
          <span>LIVE · SAT</span>
        </div>

        {/* Arrow tail apuntando al personaje (abajo a la derecha) */}
        <div style={{
          position: 'absolute',
          bottom: '-7px',
          right: '20px',
          width: '13px',
          height: '13px',
          backgroundColor: colors.bg,
          borderBottom: `1.5px solid ${colors.border}`,
          borderRight: `1.5px solid ${colors.border}`,
          transform: 'rotate(45deg)',
        }} />
      </div>

      <style>{`
        @keyframes sat-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
