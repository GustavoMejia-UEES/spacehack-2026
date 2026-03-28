import { useEffect, useState } from 'react'

export interface ToastNotification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastProps {
  notification: ToastNotification | null
  onClose?: () => void
}

export function Toast({ notification, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        if (onClose) {
          setTimeout(onClose, 300)
        }
      }, notification.duration || 4000)
      return () => clearTimeout(timer)
    }
  }, [notification, onClose])

  if (!notification) return null

  const bgColor = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90',
    warning: 'bg-yellow-500/90',
  }[notification.type]

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
    warning: '⚠',
  }[notification.type]

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 font-medium`}
      >
        <span className="text-xl">{icon}</span>
        <span>{notification.message}</span>
      </div>
    </div>
  )
}
