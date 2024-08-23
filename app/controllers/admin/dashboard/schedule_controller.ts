import { HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'

export default class ScheduleController {
  async index({ inertia }: HttpContext) {
    const events = await this.fetchAllEvents()

    return inertia.render('Admin/Dashboard/Schedule/Index', {
      title: 'Schedule',
      events: events,
    })
  }

  private async fetchAllEvents() {
    const schedules = await Schedule.query().preload('location').preload('set')

    return schedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.set ? `Shoot: ${schedule.set.name}` : 'Preparation',
      start: schedule.startTime.toISO(),
      end: schedule.endTime.toISO(),
      extendedProps: {
        location: schedule.location.name,
        type: schedule.type,
      },
    }))
  }
  async create({ inertia }: HttpContext) {}

  async store({ request, response }: HttpContext) {}

  async show({ inertia, params }: HttpContext) {}

  async edit({ inertia, params }: HttpContext) {}

  async update({ request, response, params }: HttpContext) {}

  async destroy({ response, params }: HttpContext) {}
}
