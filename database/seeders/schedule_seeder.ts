import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ScheduleFactory } from '#factories/schedule_factory'
import Location from '#models/location'
import Set from '#models/set'
import { ScheduleType } from '#enums/schedule_type'
import { DateTime } from 'luxon'

export default class ScheduleSeeder extends BaseSeeder {
  async run() {
    const locations = await Location.all()
    const sets = await Set.all()

    for (const location of locations) {
      const scheduleCount = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < scheduleCount; i++) {
        const scheduleType = this.getRandomScheduleType(location.isStudio)
        const startDate = DateTime.local().plus({ days: Math.floor(Math.random() * 30) })

        const schedule = await ScheduleFactory.merge({
          locationId: location.id,
          type: scheduleType,
          startTime: startDate,
          endTime: startDate.plus({ hours: Math.floor(Math.random() * 8) + 1 }),
        }).create()

        if (scheduleType !== ScheduleType.STUDIO_SHOOT) {
          const randomSet = sets[Math.floor(Math.random() * sets.length)]
          await schedule.related('set').associate(randomSet)
        }
      }
    }
  }

  private getRandomScheduleType(isStudio: boolean): ScheduleType {
    if (isStudio) {
      return ScheduleType.STUDIO_SHOOT
    }
    const types = [ScheduleType.SET_PREPARATION, ScheduleType.SET_SHOOT, ScheduleType.SET_REMOVAL]
    return types[Math.floor(Math.random() * types.length)]
  }
}
