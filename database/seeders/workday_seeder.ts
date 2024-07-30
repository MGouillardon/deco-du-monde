import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Schedule from '#models/schedule'
import ScheduleAssignment from '#models/schedule_assignment'
import Workday from '#models/workday'

export default class WorkdaySeeder extends BaseSeeder {
  async run() {
    const schedules = await Schedule.all()

    for (const schedule of schedules) {
      const assignments = await ScheduleAssignment.query().where('scheduleId', schedule.id)

      for (const assignment of assignments) {
        await Workday.create({
          scheduleId: schedule.id,
          userId: assignment.userId,
        })
      }
    }
  }
}
