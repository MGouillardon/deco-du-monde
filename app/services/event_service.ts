import Event from '#models/event'
import EventAssignment from '#models/event_assignment'
import { DateTime } from 'luxon'
import { EventType } from '#enums/event_type'

export class EventService {
  async fetchAllEvents() {
    const events = await Event.query().preload('location').preload('set').preload('item')

    return events.map((event) => {
      let title: string
      switch (event.type) {
        case EventType.STUDIO_SHOOT:
          title = event.item ? `Studio Shoot: ${event.item.name}` : 'Studio Shoot'
          break
        case EventType.SET_SHOOT:
          title = event.set ? `Set Shoot: ${event.set.name}` : 'Set Shoot'
          break
        case EventType.SET_PREPARATION:
          title = 'Set Preparation'
          break
        case EventType.SET_REMOVAL:
          title = 'Set Removal'
          break
        default:
          const exhaustiveCheck: never = event.type
          title = exhaustiveCheck
          console.error(`Unhandled event type: ${exhaustiveCheck}`)
      }

      return {
        id: event.id,
        title: title,
        start: event.startTime.toISO(),
        end: event.endTime.toISO(),
        extendedProps: {
          location: event.location.name,
          type: event.type,
          itemId: event.item?.id,
          itemName: event.item?.name,
          setId: event.set?.id,
          setName: event.set?.name,
        },
      }
    })
  }
  async createEvent(data: {
    locationId: number
    startTime: Date
    endTime: Date
    type: EventType
    setId?: number
    itemId?: number
    userIds?: number[]
  }) {
    const eventData: Partial<Event> = {
      locationId: data.locationId,
      startTime: DateTime.fromJSDate(data.startTime),
      endTime: DateTime.fromJSDate(data.endTime),
      type: data.type,
    }

    if (data.type === EventType.STUDIO_SHOOT) {
      eventData.itemId = data.itemId
    } else if (
      data.type === EventType.SET_SHOOT ||
      data.type === EventType.SET_PREPARATION ||
      data.type === EventType.SET_REMOVAL
    ) {
      eventData.setId = data.setId
    }

    const event = await Event.create(eventData)

    if (data.userIds && data.userIds.length > 0) {
      await EventAssignment.createMany(
        data.userIds.map((userId: number) => ({
          eventId: event.id,
          userId,
        }))
      )
    }

    return event
  }

  async getEventDetails(id: number) {
    const event = await Event.query()
      .where('id', id)
      .preload('location')
      .preload('set')
      .preload('item')
      .preload('eventAssignments', (query) => {
        query.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      })
      .firstOrFail()

    return {
      id: event.id,
      title: event.set
        ? `Shoot: ${event.set.name}`
        : event.item
          ? `Shoot: ${event.item.name}`
          : 'Preparation',
      start: event.startTime.toISO(),
      end: event.endTime.toISO(),
      location: event.location.name,
      type: event.type,
      set: event.set ? { id: event.set.id, name: event.set.name } : null,
      item: event.item ? { id: event.item.id, name: event.item.name } : null,
      assignments: event.eventAssignments.map((assignment) => ({
        id: assignment.id,
        user: {
          id: assignment.user.id,
          fullName: assignment.user.fullName,
          role: assignment.user.role.name,
        },
      })),
    }
  }

  async updateEventDates(id: number, start: string, end: string) {
    const event = await Event.findOrFail(id)
    event.startTime = DateTime.fromISO(start)
    event.endTime = DateTime.fromISO(end)
    await event.save()
    return event
  }
}
