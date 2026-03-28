import { useSatelliteMessages } from '../hooks/useSatelliteMessages'
import { CharacterViewer } from '../components/CharacterViewer'
import {
  SatelliteNotification,
  NotificationHistory,
} from '../components/SatelliteNotification'

export function VirtualAssistantPage() {
  const { messages, activeMessage, isAnimating, dismissMessage } =
    useSatelliteMessages(true)

  return (
    <div className="w-screen h-screen bg-black flex flex-col overflow-hidden">
      {/* Header - OS Style */}
      <header className="h-12 bg-gray-950 border-b border-green-500/30 flex items-center justify-between px-4 py-2 text-xs font-mono text-green-400 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>FOX-ASSISTANT v0.1β</span>
        </div>
        <div className="flex gap-2">
          <span>
            {new Date().toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span>📡 LIVE</span>
        </div>
      </header>

      {/* Main Content Area - 3D Canvas */}
      <main className="flex-1 relative overflow-hidden">
        {/* 3D Scene (zorro) */}
        <div className="w-full h-full bg-linear-to-b from-gray-900 via-black to-black">
          <CharacterViewer isAnimating={isAnimating} />

          {/* Decorative Grid Background */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, 0.05) 25%, rgba(34, 211, 238, 0.05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.05) 75%, rgba(34, 211, 238, 0.05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, 0.05) 25%, rgba(34, 211, 238, 0.05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.05) 75%, rgba(34, 211, 238, 0.05) 76%, transparent 77%, transparent)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* UI Overlay - Info Panel (Top Left) */}
        <div className="absolute top-4 left-4 text-xs font-mono text-green-400 space-y-1 backdrop-blur-sm bg-gray-950/50 p-3 rounded border border-green-500/30">
          <div>▸ SISTEMA_ACTIVO</div>
          <div>▸ SAT_FEED: {messages.length} mensajes</div>
          <div>▸ LATENCIA: &lt;200ms</div>
          <div className="mt-2 text-green-500/70">► Escuchando...</div>
        </div>

        {/* Network Status (Top Right) */}
        <div className="absolute top-4 right-4 text-xs font-mono text-green-400 backdrop-blur-sm bg-gray-950/50 p-3 rounded border border-green-500/30">
          <div>SEÑAL</div>
          <div className="text-green-500">▓▓▓▓▓</div>
        </div>

        {/* Notification - Centered at bottom */}
        <SatelliteNotification
          message={activeMessage}
          isAnimating={isAnimating}
          onDismiss={dismissMessage}
        />

        {/* Message History (Bottom Left) */}
        <div className="absolute bottom-16 left-4 backdrop-blur-sm bg-gray-950/50 p-3 rounded border border-green-500/30 max-w-xs">
          <div className="text-xs font-mono text-green-400 mb-2">HISTORIAL</div>
          <NotificationHistory messages={messages} />
        </div>
      </main>

      {/* Footer - Controls & Status */}
      <footer className="h-12 bg-gray-950 border-t border-green-500/30 flex items-center justify-between px-4 py-2 text-xs font-mono text-green-400 backdrop-blur-sm">
        <div className="flex gap-4">
          <button className="hover:text-cyan-400 transition-colors">
            🎤 VOZ
          </button>
          <button className="hover:text-cyan-400 transition-colors">
            💬 CHAT
          </button>
          <button className="hover:text-cyan-400 transition-colors">
            ⚙️ CONF
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-1 h-1 bg-yellow-500 rounded-full" />
          <span>BATERÍA: 87%</span>
        </div>
      </footer>
    </div>
  )
}
