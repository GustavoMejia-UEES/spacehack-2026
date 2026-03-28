import { useState, useCallback } from 'react'
import type { ToastNotification } from '#/components/ui/Toast'

export function useToastNotification() {
  const [toast, setToast] = useState<ToastNotification | null>(null)

  const showToast = useCallback(
    (type: ToastNotification['type'], message: string, duration = 4000) => {
      setToast({
        id: Date.now().toString(),
        type,
        message,
        duration,
      })
    },
    [],
  )

  const closeToast = useCallback(() => {
    setToast(null)
  }, [])

  return {
    toast,
    showToast,
    closeToast,
    success: (msg: string) => showToast('success', msg),
    error: (msg: string) => showToast('error', msg),
    info: (msg: string) => showToast('info', msg),
    warning: (msg: string) => showToast('warning', msg),
  }
}
