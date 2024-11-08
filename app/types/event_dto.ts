import { EventType } from '#enums/event_type'

export interface EventDTO {
  id: number
  title: string
  start: string | null
  end: string | null
  location: string
  locationId: number
  type: EventType
  completed: boolean
  completedAt: string | null
  itemId?: number | null
  itemName?: string | null
  setId?: number | null
  setName?: string | null
  assignments?: Array<{
    id: number
    userId: number
    user: {
      id: number
      fullName: string | null
      role: string
    }
  }>
}
