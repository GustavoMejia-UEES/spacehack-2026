import { CharacterViewer } from '../components/CharacterViewer'
import { CharacterControls } from '../components/CharacterControls'

export function CharacterPage() {
  return (
    <div className="w-screen h-screen bg-linear-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="w-full h-full">
        <CharacterViewer />
      </div>
      <CharacterControls />
    </div>
  )
}
