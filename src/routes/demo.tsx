import { createFileRoute } from '@tanstack/react-router'
import { DemoPage } from '#/features/character/pages/DemoPage'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})
