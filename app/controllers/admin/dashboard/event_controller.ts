import { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import { DateTime } from 'luxon'
import Location from '#models/location'
import User from '#models/user'
import { EventType } from '#enums/event_type'
import EventAssignment from '#models/event_assignment'
import { storeEventValidator } from '#validators/dashboard/event/store'
import Set from '#models/set'

export default class EventController {
  async index({ inertia }: HttpContext) {
    const events = await this.fetchAllEvents()

    return inertia.render('Admin/Dashboard/Event/Index', {
      title: 'Calendar',
      events: events,
    })
  }

  private async fetchAllEvents() {
    const events = await Event.query().preload('location').preload('set')

    return events.map((event) => ({
      id: event.id,
      title: event.set ? `Shoot: ${event.set.name}` : 'Preparation',
      start: event.startTime.toISO(),
      end: event.endTime.toISO(),
      extendedProps: {
        location: event.location.name,
        type: event.type,
      },
    }))
  }
  async create({ inertia }: HttpContext) {
    const locations = await Location.all()
    const sets = await Set.all()
    const users = await User.all()
    const eventTypes = Object.fromEntries(
      Object.entries(EventType).map(([key, value]) => [key, value])
    )

    return inertia.render('Admin/Dashboard/Event/Create', {
      title: 'Create an Event',
      locations,
      sets,
      users,
      eventTypes,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const validatedData = await request.validateUsing(storeEventValidator)

    try {
      const event = await Event.create({
        locationId: validatedData.locationId,
        startTime: DateTime.fromISO(validatedData.startTime.toISOString()),
        endTime: DateTime.fromISO(validatedData.endTime.toISOString()),
        type: validatedData.type,
        setId: validatedData.setId,
      })

      if (validatedData.userIds && validatedData.userIds.length > 0) {
        await EventAssignment.createMany(
          validatedData.userIds.map((userId: number) => ({
            eventId: event.id,
            userId,
          }))
        )
      }

      session.flash('success', 'Event created successfully')
      return response.redirect().toRoute('index.event')
    } catch (error) {
      console.error('Error creating event:', error)
      session.flash('error', 'Failed to create event. Please try again.')
      return response.redirect().back()
    }
  }

  async show({ inertia, params }: HttpContext) {}

  async edit({ inertia, params }: HttpContext) {}

  async update({ request, response, params, session }: HttpContext) {
    const { id } = params
    const { start, end } = request.only(['start', 'end'])

    const event = await Event.findOrFail(id)

    event.startTime = DateTime.fromISO(start)
    event.endTime = DateTime.fromISO(end)

    await event.save()

    session.flash('success', 'Event updated successfully')
    return response.redirect().toRoute('index.event')
  }

  async destroy({ response, params }: HttpContext) {}
}
