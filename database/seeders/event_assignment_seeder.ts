import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Event from '#models/event'
import User from '#models/user'
import EventAssignment from '#models/event_assignment'
import { EventType } from '#enums/event_type'
import Roles from '#enums/roles'

export default class EventAssignmentSeeder extends BaseSeeder {
  async run() {
    const events = await Event.all()
    const usersByRole = await this.getUsersByRole()

    for (const event of events) {
      const requiredRoles = this.getRequiredRoles(event.type)

      for (const roleId of requiredRoles) {
        const availableUsers = usersByRole[roleId]
        if (availableUsers && availableUsers.length > 0) {
          const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]
          await EventAssignment.create({
            eventId: event.id,
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

  private getRequiredRoles(eventType: EventType): number[] {
    switch (eventType) {
      case EventType.STUDIO_SHOOT:
        return [Roles.PHOTOGRAPH, Roles.ASSISTANT_PHOTOGRAPH]
      case EventType.SET_PREPARATION:
        return [Roles.DECORATOR, Roles.ASSISTANT_DECORATOR, Roles.DRIVER_ASSISTANT]
      case EventType.SET_SHOOT:
        return [
          Roles.DECORATOR,
          Roles.ASSISTANT_DECORATOR,
          Roles.PHOTOGRAPH,
          Roles.ASSISTANT_PHOTOGRAPH,
          Roles.DRIVER_ASSISTANT,
        ]
      case EventType.SET_REMOVAL:
        return [Roles.ASSISTANT_DECORATOR, Roles.DRIVER_ASSISTANT]
      default:
        return []
    }
  }
}
