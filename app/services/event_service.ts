import Event from '#models/event'
import EventAssignment from '#models/event_assignment'
import { DateTime } from 'luxon'
import { EventType } from '#enums/event_type'
import User from '#models/user'
import Location from '#models/location'
import Set from '#models/set'
import Item from '#models/item'
import type { EventDTO } from '#types/event_dto'

export class EventService {
  async fetchAllEvents(): Promise<EventDTO[]> {
    const events = await Event.query().withScopes((scope) => scope.withDetails())

    return events.map(this.mapEventToDTO)
  }

  async getEventFormData() {
    const [locations, sets, items, users] = await Promise.all([
      this.fetchLocations(),
      this.fetchSets(),
      this.fetchItems(),
      this.fetchUsers(),
    ])

    return {
      locations,
      sets,
      items,
      usersByRole: User.groupUsersByRole(users),
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
    const event = await this.fetchEventById(id)

    return this.mapEventToDTO(event)
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

  private async fetchLocations() {
    return Location.query().select('id', 'name').orderBy('name')
  }

  private async fetchSets() {
    return Set.query().select('id', 'name').orderBy('name')
  }

  private async fetchItems() {
    return Item.query().select('id', 'name').orderBy('name')
  }

  private async fetchUsers() {
    return User.query()
      .select('id', 'fullName', 'roleId')
      .withScopes((scopes) => scopes.withoutAdmin())
      .preload('role', (query) => query.select('id', 'name'))
  }

  private async fetchEventById(id: number) {
    return Event.query()
      .where('id', id)
      .withScopes((scope) => scope.withDetails())
      .firstOrFail()
  }

  private mapEventToDTO(event: Event): EventDTO {
    return {
      id: event.id,
      title: event.title,
      start: event.startTime.toISO(),
      end: event.endTime.toISO(),
      location: event.location.name,
      locationId: event.locationId,
      type: event.type,
      itemId: event.item?.id,
      itemName: event.item?.name,
      setId: event.set?.id,
      setName: event.set?.name,
      assignments: event.eventAssignments?.map((assignment) => ({
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
}
