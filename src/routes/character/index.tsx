import { createFileRoute } from '@tanstack/react-router'
import { VirtualAssistantPage } from '#/features/character/pages/VirtualAssistantPage'

export const Route = createFileRoute('/character/')({
  component: VirtualAssistantPage,
})
