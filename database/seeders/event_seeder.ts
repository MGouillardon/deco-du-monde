import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { EventFactory } from '#factories/event_factory'
import Location from '#models/location'
import Set from '#models/set'
import { EventType } from '#enums/event_type'
import { DateTime } from 'luxon'

export default class EventSeeder extends BaseSeeder {
  async run() {
    const locations = await Location.all()
    const sets = await Set.all()

    for (const location of locations) {
      const eventCount = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < eventCount; i++) {
        const eventType = this.getRandomEventType(location.isStudio)
        const startDate = this.getRandomStartDate()
        const endDate = this.getRandomEndDate(startDate)

        const event = await EventFactory.merge({
          locationId: location.id,
          type: eventType,
          startTime: startDate,
          endTime: endDate,
        }).create()

        if (eventType !== EventType.STUDIO_SHOOT) {
          const randomSet = sets[Math.floor(Math.random() * sets.length)]
          await event.related('set').associate(randomSet)
        }
      }
    }
  }

  private getRandomEventType(isStudio: boolean): EventType {
    if (isStudio) {
      return EventType.STUDIO_SHOOT
    }
    const types = [EventType.SET_PREPARATION, EventType.SET_SHOOT, EventType.SET_REMOVAL]
    return types[Math.floor(Math.random() * types.length)]
  }

  private getRandomStartDate(): DateTime {
    const daysToAdd = Math.floor(Math.random() * 30)
    const hour = Math.floor(Math.random() * 13) + 8
    const minute = Math.floor(Math.random() * 4) * 15
    return DateTime.local()
      .plus({ days: daysToAdd })
      .set({ hour, minute, second: 0, millisecond: 0 })
  }

  private getRandomEndDate(startDate: DateTime): DateTime {
    const maxDuration = startDate.endOf('day').diff(startDate, 'hours').hours
    const duration = Math.min(Math.floor(Math.random() * 8) + 1, maxDuration)
    let endDate = startDate.plus({ hours: duration })

    if (endDate.day !== startDate.day) {
      endDate = startDate.endOf('day')
    }

    if (endDate.diff(startDate, 'hours').hours < 1) {
      endDate = startDate.plus({ hours: 1 })
    }

    return endDate
  }
}
