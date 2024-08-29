import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { EventService } from '#services/event_service'
import { storeEventValidator } from '#validators/dashboard/event/store'
import { updateEventValidator } from '#validators/dashboard/event/update'

@inject()
export default class EventController {
  constructor(private eventService: EventService) {}

  async index({ inertia }: HttpContext) {
    const events = await this.eventService.fetchAllEvents()
    return inertia.render('Admin/Dashboard/Events/Index', { title: 'Calendar', events })
  }

  async create({ inertia }: HttpContext) {
    const data = await this.eventService.getEventFormData()
    return inertia.render('Admin/Dashboard/Events/Create', { title: 'Create an Event', ...data })
  }

  async store({ request, response, session, inertia }: HttpContext) {
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

  async show({ inertia, params }: HttpContext) {
    const event = await this.eventService.getEventDetails(params.id)
    return inertia.render('Admin/Dashboard/Events/Show', { title: event.title, event })
  }

  async edit({ inertia, params }: HttpContext) {
    const [event, formData] = await Promise.all([
      this.eventService.getEventDetails(params.id),
      this.eventService.getEventFormData(),
    ])
    return inertia.render('Admin/Dashboard/Events/Edit', {
      title: 'Edit Event',
      event,
      ...formData,
    })
  }

  async update({ request, response, session }: HttpContext) {
    const { id } = request.params()
    const validatedData = await request.validateUsing(updateEventValidator)
    await this.eventService.updateEvent(id, validatedData)
    session.flash('success', 'Event updated successfully')
    return response.redirect().toRoute('index.event')
  }

  async updateEventDates({ request, response, session }: HttpContext) {
    const { id } = request.params()
    const { start, end } = request.only(['start', 'end'])
    await this.eventService.updateEventDates(id, start, end)
    session.flash('success', 'Event dates updated successfully')
    return response.redirect().toRoute('index.event')
  }

  async destroy({ params, response, session }: HttpContext) {
    await this.eventService.deleteEvent(params.id)
    session.flash('success', 'Event deleted successfully')
    return response.redirect().toRoute('index.event')
  }
}
