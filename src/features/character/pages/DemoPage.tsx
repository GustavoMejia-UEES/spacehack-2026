import { useState } from 'react'
import type { ToastNotification } from '#/components/ui/Toast'
import { FloatingCharacter3D } from '../components/FloatingCharacter3D_v2'
import { Toast } from '#/components/ui/Toast'
import { useSatelliteMessages } from '../hooks/useSatelliteMessages'
import { N8NInput } from '../components/N8NInput'
import type { SatelliteMessage } from '../hooks/useSatelliteMessages'

export function DemoPage() {
  const [toast, setToast] = useState<ToastNotification | null>(null)
  const [externalMessage, setExternalMessage] =
    useState<SatelliteMessage | null>(null)

  // URL de n8n - cuando te pasen el webhook, reemplázalo aquí
  // Puedes también usar una variable de entorno: import.meta.env.VITE_N8N_WEBHOOK_URL
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || ''

  const { activeMessage, isAnimating, dismissMessage } = useSatelliteMessages(
    true,
    externalMessage,
  )

  const showNotification = (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
  ) => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
      duration: 4000,
    })
  }

  return (
    <div className="w-screen h-screen bg-linear-to-br from-slate-900 via-black to-slate-900 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center mb-12 z-30 relative">
        <h1 className="text-5xl font-bold text-white mb-2">
          Asistente Virtual 3D
        </h1>
        <p className="text-gray-400 text-lg">Prototype - Spacehack 2026</p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl w-full px-6 space-y-6 z-30 relative">
        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() =>
              showNotification('success', '✨ Ruta optimizada detectada!')
            }
            className="bg-green-900/30 border border-green-500/50 hover:border-green-400 hover:bg-green-900/50 rounded-lg p-4 text-green-300 transition-all"
          >
            🟢 Éxito
          </button>
          <button
            onClick={() =>
              showNotification('warning', '⚠️ Congestión en Canal de Panamá')
            }
            className="bg-yellow-900/30 border border-yellow-500/50 hover:border-yellow-400 hover:bg-yellow-900/50 rounded-lg p-4 text-yellow-300 transition-all"
          >
            🟡 Alerta
          </button>
          <button
            onClick={() =>
              showNotification('info', 'ⓘ Datos satelitales actualizados')
            }
            className="bg-blue-900/30 border border-blue-500/50 hover:border-blue-400 hover:bg-blue-900/50 rounded-lg p-4 text-blue-300 transition-all"
          >
            🔵 Info
          </button>
          <button
            onClick={() =>
              showNotification(
                'error',
                '✕ Error en el proceso de sincronización',
              )
            }
            className="bg-red-900/30 border border-red-500/50 hover:border-red-400 hover:bg-red-900/50 rounded-lg p-4 text-red-300 transition-all"
          >
            🔴 Error
          </button>
        </div>

        {/* Info Panel */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-white font-semibold mb-2">📝 Instrucciones:</h2>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Haz clic en los botones para disparar notificaciones</li>
            <li>El zorro reaccionará animándose cuando reciba mensajes</li>
            <li>
              Las notificaciones desaparecen automáticamente después de 4
              segundos
            </li>
            <li>
              El modelo 3D está posicionado abajo a la derecha con fondo
              transparente
            </li>
          </ul>
        </div>

        {/* Technical Info */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-white font-semibold mb-2">
            🔧 Características Técnicas:
          </h2>
          <ul className="text-gray-300 text-sm space-y-1 font-mono">
            <li>✓ Canvas con fondo transparente</li>
            <li>✓ Posicionamiento fixed (bottom-right)</li>
            <li>✓ Optimizado para mobile (60 FPS)</li>
            <li>✓ Modelo 3D local (GLB)</li>
            <li>✓ Toast notifications con React</li>
          </ul>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast notification={toast} onClose={() => setToast(null)} />

      {/* Botón Flotante N8N - Enviar mensajes al Asistente */}
      <N8NInput
        n8nWebhookUrl={n8nWebhookUrl}
        showDebug={true}
        onMessageReceived={(msg) => {
          console.log('💬 Mensaje recibido en DemoPage:', msg)
          setExternalMessage(msg)
        }}
        onAudioPlay={(isPlaying) => {
          console.log('🔊 Audio:', isPlaying ? 'playing' : 'stopped')
        }}
      />

      {/* Floating 3D Character con Burbuja Integrada */}
      <FloatingCharacter3D
        position="bottom-right"
        size="md"
        isAnimating={isAnimating}
        message={activeMessage}
        onDismissMessage={dismissMessage}
      />
    </div>
  )
}
