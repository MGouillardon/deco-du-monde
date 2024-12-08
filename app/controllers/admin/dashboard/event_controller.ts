import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { EventService } from '#services/event_service'
import { storeEventValidator } from '#validators/dashboard/event/store'
import { updateEventValidator } from '#validators/dashboard/event/update'
import db from '@adonisjs/lucid/services/db'
import Event from '#models/event'
import EventPolicy from '#policies/event_policy'

@inject()
export default class EventController {
  constructor(private eventService: EventService) {}

  async index({ inertia, bouncer, auth }: HttpContext) {
    await bouncer.with(EventPolicy).authorize('viewAny')

    const events = await this.eventService.fetchAllEvents(auth.user!)
    return inertia.render('Admin/Dashboard/Events/Index', {
      title: 'Calendar',
      events,
      can: {
        create: await bouncer.with(EventPolicy).allows('create'),
      },
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with(EventPolicy).authorize('create')

    const data = await this.eventService.getEventFormData()
    return inertia.render('Admin/Dashboard/Events/Create', {
      title: 'Create an Event',
      ...data,
    })
  }

  async store({ request, response, session, inertia, bouncer }: HttpContext) {
    await bouncer.with(EventPolicy).authorize('create')

    try {
      const validatedData = await request.validateUsing(storeEventValidator)
      await this.eventService.createEvent(validatedData)
      session.flash({ success: 'Event created successfully' })
      return response.redirect().toRoute('index.event')
    } catch (error) {
      return inertia.render('Admin/Dashboard/Events/Create', {
        errors: error.messages,
        ...(await this.eventService.getEventFormData()),
      })
    }
  }

  async show({ inertia, params, bouncer }: HttpContext) {
    const eventDetails = await this.eventService.getEventDetails(params.id)
    const event = await Event.findOrFail(params.id)

    await bouncer.with(EventPolicy).authorize('view')

    return inertia.render('Admin/Dashboard/Events/Show', {
      title: eventDetails.title,
      event: eventDetails,
      can: {
        update: await bouncer.with(EventPolicy).allows('update', event),
        delete: await bouncer.with(EventPolicy).allows('delete'),
        complete: await bouncer.with(EventPolicy).allows('complete', event),
      },
    })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    await bouncer.with(EventPolicy).authorize('update', event)

    const [eventDetails, formData] = await Promise.all([
      this.eventService.getEventDetails(params.id),
      this.eventService.getEventFormData(),
    ])

    return inertia.render('Admin/Dashboard/Events/Edit', {
      title: 'Edit Event',
      event: eventDetails,
      ...formData,
    })
  }

  async update({ request, response, session, bouncer }: HttpContext) {
    const { id } = request.params()
    const event = await Event.findOrFail(id)

    await bouncer.with(EventPolicy).authorize('update', event)

    const validatedData = await request.validateUsing(updateEventValidator)
    await this.eventService.updateEvent(id, validatedData)
    session.flash('success', 'Event updated successfully')
    return response.redirect().toRoute('index.event')
  }

  async updateEventDates({ request, response, session, bouncer }: HttpContext) {
    const { id } = request.params()
    const event = await Event.findOrFail(id)

    await bouncer.with(EventPolicy).authorize('update', event)

    const { start, end } = request.only(['start', 'end'])
    await this.eventService.updateEventDates(id, start, end)
    session.flash('success', 'Event dates updated successfully')
    return response.redirect().toRoute('index.event')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    await bouncer.with(EventPolicy).authorize('delete')

    await this.eventService.deleteEvent(params.id)
    session.flash('success', 'Event deleted successfully')
    return response.redirect().toRoute('index.event')
  }

  async complete({ params, response, session, bouncer }: HttpContext) {
    const event = await Event.query().where('id', params.id).preload('item').firstOrFail()

    await bouncer.with(EventPolicy).authorize('complete', event)

    await db.transaction(async (trx) => {
      await event.complete(trx)
    })

    session.flash('success', 'Event marked as completed')
    return response.redirect().back()
  }
}
