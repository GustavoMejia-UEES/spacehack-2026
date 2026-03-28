// 🦊 CHARACTER MODULE - EXPORTS
// Componentes principales refactorizados (2.0)

export { FloatingCharacter3D } from './components/FloatingCharacter3D'
export { GenericModel } from './components/GenericModel'
export { ChatBubble } from './components/ChatBubble'

// Soporte legacy (mantener para compatibilidad)
export { Fox } from './models/Fox'
export { CharacterViewer } from './components/CharacterViewer'
export { CharacterControls } from './components/CharacterControls'
export {
  SatelliteNotification,
  NotificationHistory,
} from './components/SatelliteNotification'

// Páginas
export { CharacterPage } from './pages/CharacterPage'
export { VirtualAssistantPage } from './pages/VirtualAssistantPage'
export { DemoPage } from './pages/DemoPage'

// Hooks y tipos
export * from './types/character.types'
export * from './hooks/useCharacterAnimations'
export * from './hooks/useSatelliteMessages'
export type { SatelliteMessage } from './hooks/useSatelliteMessages'
