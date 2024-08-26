// app/controllers/event_controller.ts

import { HttpContext } from '@adonisjs/core/http'
import { EventService } from '#services/event_service'
import Location from '#models/location'
import User from '#models/user'
import { EventType } from '#enums/event_type'
import { storeEventValidator } from '#validators/dashboard/event/store'
import Set from '#models/set'
import Item from '#models/item'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'

@inject()
export default class EventController {
  constructor(private eventService: EventService) {}

  async index({ inertia }: HttpContext) {
    const events = await this.eventService.fetchAllEvents()

    return inertia.render('Admin/Dashboard/Event/Index', {
      title: 'Calendar',
      events: events,
    })
  }

  async create({ inertia }: HttpContext) {
    const [locations, sets, items, users] = await Promise.all([
      Location.query().select('id', 'name').orderBy('name'),
      Set.query().select('id', 'name').orderBy('name'),
      Item.query().select('id', 'name').orderBy('name'),
      User.query()
        .select('id', 'fullName', 'roleId')
        .withScopes((scopes) => scopes.withoutAdmin())
        .preload('role', (query) => query.select('id', 'name')),
    ])

    const usersByRole: { [key: string]: User[] } = users.reduce(
      (acc, user) => {
        const roleName = user.role.name.toLowerCase()
        ;(acc[roleName] ??= []).push(user)
        return acc
      },
      {} as { [key: string]: User[] }
    )

    const eventTypes = Object.fromEntries(
      Object.entries(EventType).map(([key, value]) => [key, value])
    )

    return inertia.render('Admin/Dashboard/Event/Create', {
      title: 'Create an Event',
      locations,
      sets,
      items,
      usersByRole,
      eventTypes,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const validatedData = await request.validateUsing(storeEventValidator)

    try {
      await this.eventService.createEvent(validatedData)
      session.flash('success', 'Event created successfully')
      return response.redirect().toRoute('index.event')
    } catch (error) {
      console.error('Error creating event:', error)
      session.flash('error', 'Failed to create event. Please try again.')
      return response.redirect().back()
    }
  }

  async show({ inertia, params, response, session }: HttpContext) {
    try {
      const event = await this.eventService.getEventDetails(params.id)
      return inertia.render('Admin/Dashboard/Event/Show', {
        title: `Event Details: ${event.title}`,
        event: event,
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        session.flash('error', 'Event not found')
      } else {
        console.error('Error fetching event:', error)
        session.flash('error', 'An error occurred while fetching the event')
      }
      return response.redirect().toRoute('index.event')
    }
  }

  async edit({ inertia, params }: HttpContext) {
    // To be implemented
  }

  async update({ request, response, params, session }: HttpContext) {
    const { id } = params
    const { start, end } = request.only(['start', 'end'])

    try {
      await this.eventService.updateEventDates(id, start, end)
      session.flash('success', 'Event updated successfully')
    } catch (error) {
      console.error('Error updating event:', error)
      session.flash('error', 'Failed to update event. Please try again.')
    }

    return response.redirect().toRoute('index.event')
  }

  async destroy({ response, params }: HttpContext) {
    // To be implemented
  }
}
