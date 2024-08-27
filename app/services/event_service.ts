import Event from '#models/event'
import EventAssignment from '#models/event_assignment'
import { DateTime } from 'luxon'
import { EventType } from '#enums/event_type'
import User from '#models/user'
import Location from '#models/location'
import Set from '#models/set'
import Item from '#models/item'

export interface EventDTO {
  id: number
  title: string
  start: string | null
  end: string | null
  location: string
  locationId?: number
  type: EventType
  itemId?: number | null
  itemName?: string | null
  setId?: number | null
  setName?: string | null
  assignments?: Array<{
    id: number
    user: {
      id: number
      fullName: string | null
      role: string
    }
  }>
}

export class EventService {
  private getEventTitle(event: Event): string {
    const titles = {
      [EventType.STUDIO_SHOOT]: `Studio Shoot: ${event.item?.name ?? ''}`,
      [EventType.SET_SHOOT]: `Set Shoot: ${event.set?.name ?? ''}`,
      [EventType.SET_PREPARATION]: 'Set Preparation',
      [EventType.SET_REMOVAL]: 'Set Removal',
    }
    return titles[event.type] ?? 'Unknown Event Type'
  }

  async fetchAllEvents(): Promise<EventDTO[]> {
    const events = await Event.query().preload('location').preload('set').preload('item')

    return events.map((event) => ({
      id: event.id,
      title: this.getEventTitle(event),
      start: event.startTime.toISO(),
      end: event.endTime.toISO(),
      location: event.location.name,
      type: event.type,
      itemId: event.item?.id,
      itemName: event.item?.name,
      setId: event.set?.id,
      setName: event.set?.name,
    }))
  }

  async getEventFormData() {
    const [locations, sets, items, users] = await Promise.all([
      Location.query().select('id', 'name').orderBy('name'),
      Set.query().select('id', 'name').orderBy('name'),
      Item.query().select('id', 'name').orderBy('name'),
      User.query()
        .select('id', 'fullName', 'roleId')
        .withScopes((scopes) => scopes.withoutAdmin())
        .preload('role', (query) => query.select('id', 'name')),
    ])

    return {
      locations,
      sets,
      items,
      usersByRole: this.groupUsersByRole(users),
      eventTypes: Object.fromEntries(Object.entries(EventType)),
    }
  }

  async createEvent(data: any): Promise<Event> {
    const event = await Event.create({
      locationId: data.locationId,
      startTime: DateTime.fromJSDate(data.startTime),
      endTime: DateTime.fromJSDate(data.endTime),
      type: data.type,
      itemId: data.type === EventType.STUDIO_SHOOT ? data.itemId : undefined,
      setId: [EventType.SET_SHOOT, EventType.SET_PREPARATION, EventType.SET_REMOVAL].includes(
        data.type
      )
        ? data.setId
        : undefined,
    })

    if (data.userIds?.length) {
      await EventAssignment.createMany(
        data.userIds.map((userId: number) => ({ eventId: event.id, userId }))
      )
    }

    return event
  }

  async getEventDetails(id: number): Promise<EventDTO> {
    const event = await Event.query()
      .where('id', id)
      .preload('location')
      .preload('set')
      .preload('item')
      .preload('eventAssignments', (query) =>
        query.preload('user', (userQuery) => userQuery.preload('role'))
      )
      .firstOrFail()

    return {
      id: event.id,
      title: this.getEventTitle(event),
      start: event.startTime.toISO(),
      end: event.endTime.toISO(),
      location: event.location.name,
      locationId: event.locationId,
      type: event.type,
      setId: event.set?.id,
      setName: event.set?.name,
      itemId: event.item?.id,
      itemName: event.item?.name,
      assignments: event.eventAssignments.map((assignment) => ({
        id: assignment.id,
        userId: assignment.userId,
        user: {
          id: assignment.user.id,
          fullName: assignment.user.fullName,
          role: assignment.user.role.name,
        },
      })),
    }
  }

  async updateEvent(id: number, data: any): Promise<Event> {
    const event = await Event.findOrFail(id)
    event.merge({
      locationId: data.locationId,
      startTime: DateTime.fromJSDate(data.startTime),
      endTime: DateTime.fromJSDate(data.endTime),
      type: data.type,
      itemId: data.type === EventType.STUDIO_SHOOT ? data.itemId : undefined,
      setId: [EventType.SET_SHOOT, EventType.SET_PREPARATION, EventType.SET_REMOVAL].includes(
        data.type
      )
        ? data.setId
        : undefined,
    })
    await event.save()

    if (data.assignments) {
      await EventAssignment.query().where('eventId', event.id).delete()
      await EventAssignment.createMany(
        data.assignments.map((assignment: { userId: number }) => ({
          eventId: event.id,
          userId: assignment.userId,
        }))
      )
    }

    await event.load('eventAssignments', (query) =>
      query.preload('user', (userQuery) => userQuery.preload('role'))
    )

    return event
  }

  async updateEventDates(id: number, start: string, end: string): Promise<Event> {
    const event = await Event.findOrFail(id)
    event.merge({
      startTime: DateTime.fromISO(start),
      endTime: DateTime.fromISO(end),
    })
    await event.save()
    return event
  }

  async deleteEvent(id: number): Promise<void> {
    const event = await Event.findOrFail(id)
    await event.delete()
  }

  private groupUsersByRole(users: User[]): { [key: string]: User[] } {
    return users.reduce(
      (acc, user) => {
        const roleName = user.role.name.toLowerCase()
        ;(acc[roleName] ??= []).push(user)
        return acc
      },
      {} as { [key: string]: User[] }
    )
  }
}
