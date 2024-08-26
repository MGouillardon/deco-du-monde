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
    const minute = Math.random() < 0.5 ? 0 : 30
    return DateTime.local()
      .plus({ days: daysToAdd })
      .set({ hour, minute, second: 0, millisecond: 0 })
  }

  private getRandomEndDate(startDate: DateTime): DateTime {
    const maxEndTime = startDate.set({ hour: 20, minute: 0 })
    let duration = Math.floor(Math.random() * 6) + 1

    duration = Math.ceil(duration * 2) / 2

    let endDate = startDate.plus({ hours: duration })

    if (endDate > maxEndTime) {
      endDate = maxEndTime
    }

    const minutes = endDate.minute
    if (minutes < 15) {
      endDate = endDate.set({ minute: 0 })
    } else if (minutes < 45) {
      endDate = endDate.set({ minute: 30 })
    } else {
      endDate = endDate.plus({ hours: 1 }).set({ minute: 0 })
    }

    if (endDate.diff(startDate, 'hours').hours < 1) {
      endDate = startDate.plus({ hours: 1 })
    }

    return endDate
  }
}
