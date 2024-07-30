import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ScheduleFactory } from '#factories/schedule_factory'
import Location from '#models/location'
import Set from '#models/set'
import { ScheduleType } from '#enums/schedule_type'

export default class ScheduleSeeder extends BaseSeeder {
  async run() {
    const locations = await Location.all()
    const sets = await Set.all()

    for (const location of locations) {
      const scheduleCount = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < scheduleCount; i++) {
        const schedule = await ScheduleFactory.merge({ locationId: location.id }).create()

        if (schedule.type !== ScheduleType.STUDIO_SHOOT) {
          const randomSet = sets[Math.floor(Math.random() * sets.length)]
          await schedule.related('set').associate(randomSet)
        }
      }
    }
  }
}
