import { useEffect } from 'react'

export function useCharacterAnimations() {
  useEffect(() => {
    // TODO: Implementar lógica de animaciones
    console.log('Character animations hook initialized')
  }, [])

  return {
    playAnimation: (name: string) => {
      console.log(`Playing animation: ${name}`)
    },
    stopAnimation: () => {
      console.log('Stopping animation')
    },
  }
}
