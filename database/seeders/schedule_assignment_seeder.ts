import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Schedule from '#models/schedule'
import User from '#models/user'
import ScheduleAssignment from '#models/schedule_assignment'
import { ScheduleType } from '#enums/schedule_type'
import Roles from '#enums/roles'

export default class ScheduleAssignmentSeeder extends BaseSeeder {
  async run() {
    const schedules = await Schedule.all()
    const usersByRole = await this.getUsersByRole()

    for (const schedule of schedules) {
      const requiredRoles = this.getRequiredRoles(schedule.type)

      for (const roleId of requiredRoles) {
        const availableUsers = usersByRole[roleId]
        if (availableUsers && availableUsers.length > 0) {
          const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]
          await ScheduleAssignment.create({
            scheduleId: schedule.id,
            userId: randomUser.id,
          })
        }
      }
    }
  }

  private async getUsersByRole() {
    const users = await User.all()
    return users.reduce(
      (acc, user) => {
        if (!acc[user.roleId]) {
          acc[user.roleId] = []
        }
        acc[user.roleId].push(user)
        return acc
      },
      {} as { [key: number]: User[] }
    )
  }

  private getRequiredRoles(scheduleType: ScheduleType): number[] {
    switch (scheduleType) {
      case ScheduleType.STUDIO_SHOOT:
        return [Roles.PHOTOGRAPH, Roles.ASSISTANT_PHOTOGRAPH]
      case ScheduleType.SET_PREPARATION:
        return [Roles.DECORATOR, Roles.ASSISTANT_DECORATOR, Roles.DRIVER_ASSISTANT]
      case ScheduleType.SET_SHOOT:
        return [
          Roles.DECORATOR,
          Roles.ASSISTANT_DECORATOR,
          Roles.PHOTOGRAPH,
          Roles.ASSISTANT_PHOTOGRAPH,
          Roles.DRIVER_ASSISTANT,
        ]
      case ScheduleType.SET_REMOVAL:
        return [Roles.ASSISTANT_DECORATOR, Roles.DRIVER_ASSISTANT]
      default:
        return []
    }
  }
}
