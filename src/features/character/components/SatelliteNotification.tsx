import { useEffect, useState } from 'react'
import type { SatelliteMessage } from '../hooks/useSatelliteMessages'

interface NotificationProps {
  message: SatelliteMessage | null
  isAnimating: boolean
  onDismiss: () => void
}

export function SatelliteNotification({
  message,
  isAnimating,
  onDismiss,
}: NotificationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [message])

  if (!message || !visible) return null

  const getBgColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-900/80 border-red-500'
      case 'warning':
        return 'bg-yellow-900/80 border-yellow-500'
      case 'info':
        return 'bg-blue-900/80 border-blue-500'
      default:
        return 'bg-gray-900/80 border-gray-500'
    }
  }

  return (
    <div
      className={`fixed bottom-12 left-4 right-4 max-w-sm mx-auto z-50 transition-all duration-300 ${
        isAnimating
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        className={`border-2 rounded-lg p-4 ${getBgColor(message.type)} backdrop-blur-lg`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{message.icon}</span>
            <h3 className="text-green-400 font-bold text-sm uppercase tracking-wider font-mono">
              {message.title}
            </h3>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <p className="text-white text-sm leading-relaxed font-mono">
          {message.content}
        </p>

        {/* Footer - Timestamp & Status */}
        <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
          <span className="font-mono">
            {new Date(message.timestamp).toLocaleTimeString('es-ES')}
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>
      </div>

      {/* Decorative glitch effect */}
      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-green-400 to-transparent opacity-50" />
    </div>
  )
}

// Historial minimalista (abajo)
interface NotificationHistoryProps {
  messages: SatelliteMessage[]
}

export function NotificationHistory({ messages }: NotificationHistoryProps) {
  return (
    <div className="absolute bottom-2 left-2 right-2 text-xs text-gray-500 font-mono max-h-20 overflow-y-auto">
      {messages.slice(-3).map((msg) => (
        <div
          key={msg.id}
          className="text-gray-400 truncate hover:text-gray-300"
        >
          {msg.icon} {msg.title}
        </div>
      ))}
    </div>
  )
}
