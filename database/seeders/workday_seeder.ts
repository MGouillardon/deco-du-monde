import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Event from '#models/event'
import EventAssignment from '#models/event_assignment'
import Workday from '#models/workday'

export default class WorkdaySeeder extends BaseSeeder {
  async run() {
    const events = await Event.all()

    for (const event of events) {
      const assignments = await EventAssignment.query().where('eventId', event.id)

      for (const assignment of assignments) {
        await Workday.create({
          eventId: event.id,
          userId: assignment.userId,
        })
      }
    }
  }
}
