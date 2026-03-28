export type CharacterType = 'fox' | 'pigeon' | 'other'

export interface CharacterConfig {
  name: string
  type: CharacterType
  modelPath: string
  animationEnabled: boolean
}

export interface CharacterState {
  isAnimating: boolean
  currentAnimation: string | null
}
