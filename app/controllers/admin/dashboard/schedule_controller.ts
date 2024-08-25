import { HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'
import { DateTime } from 'luxon'
import Location from '#models/location'
import User from '#models/user'
import { ScheduleType } from '#enums/schedule_type'
import ScheduleAssignment from '#models/schedule_assignment'
import { storeScheduleValidator } from '#validators/dashboard/schedule/store'
import Set from '#models/set'

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
  async create({ inertia }: HttpContext) {
    const locations = await Location.all()
    const sets = await Set.all()
    const users = await User.all()
    const scheduleTypes = Object.fromEntries(
      Object.entries(ScheduleType).map(([key, value]) => [key, value])
    )

    return inertia.render('Admin/Dashboard/Schedule/Create', {
      title: 'Create an Event',
      locations,
      sets,
      users,
      scheduleTypes,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const validatedData = await request.validateUsing(storeScheduleValidator)

    try {
      const schedule = await Schedule.create({
        locationId: validatedData.locationId,
        startTime: DateTime.fromISO(validatedData.startTime.toISOString()),
        endTime: DateTime.fromISO(validatedData.endTime.toISOString()),
        type: validatedData.type,
        setId: validatedData.setId,
      })

      if (validatedData.userIds && validatedData.userIds.length > 0) {
        await ScheduleAssignment.createMany(
          validatedData.userIds.map((userId: number) => ({
            scheduleId: schedule.id,
            userId,
          }))
        )
      }

      session.flash('success', 'Event created successfully')
      return response.redirect().toRoute('index.schedule')
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

    const schedule = await Schedule.findOrFail(id)

    schedule.startTime = DateTime.fromISO(start)
    schedule.endTime = DateTime.fromISO(end)

    await schedule.save()

    session.flash('success', 'Event updated successfully')
    return response.redirect().toRoute('index.schedule')
  }

  async destroy({ response, params }: HttpContext) {}
}
