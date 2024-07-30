import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Schedule from '#models/schedule'
import User from '#models/user'
import Workday from '#models/workday'

export default class WorkdaySeeder extends BaseSeeder {
  async run() {
    const schedules = await Schedule.all()
    const users = await User.all()

    for (const schedule of schedules) {
      const assignedUsers = new Set()
      const assignmentCount = Math.floor(Math.random() * 3) + 2

      for (let i = 0; i < assignmentCount; i++) {
        let randomUser
        do {
          randomUser = users[Math.floor(Math.random() * users.length)]
        } while (assignedUsers.has(randomUser.id))

        assignedUsers.add(randomUser.id)

        await Workday.create({
          scheduleId: schedule.id,
          userId: randomUser.id,
        })
      }
    }
  }
}
