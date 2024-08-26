import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { EventFactory } from '#factories/event_factory'
import Location from '#models/location'
import Set from '#models/set'
import Item from '#models/item'
import { EventType } from '#enums/event_type'
import { DateTime } from 'luxon'

export default class EventSeeder extends BaseSeeder {
  async run() {
    const locations = await Location.all()
    const sets = await Set.all()
    const items = await Item.all()

    for (const location of locations) {
      if (location.isStudio) {
        await this.createStudioEvents(location, items)
      } else {
        await this.createSetEvents(location, sets)
      }
    }
  }

  private async createStudioEvents(location: Location, items: Item[]) {
    const eventCount = Math.floor(Math.random() * 3) + 3
    for (let i = 0; i < eventCount; i++) {
      const startDate = this.getRandomStartDate()
      const endDate = this.getRandomEndDate(startDate)
      const randomItem = items[Math.floor(Math.random() * items.length)]

      await EventFactory.merge({
        locationId: location.id,
        type: EventType.STUDIO_SHOOT,
        startTime: startDate,
        endTime: endDate,
        itemId: randomItem.id,
      }).create()
    }
  }

  private async createSetEvents(location: Location, sets: Set[]) {
    const setCount = Math.floor(Math.random() * 2) + 1 // Create 1 or 2 set workflows
    for (let i = 0; i < setCount; i++) {
      const randomSet = sets[Math.floor(Math.random() * sets.length)]
      let currentDate = this.getRandomStartDate()

      // Create Set Preparation event
      const prepStartDate = currentDate
      const prepEndDate = this.getRandomEndDate(prepStartDate)
      await EventFactory.merge({
        locationId: location.id,
        type: EventType.SET_PREPARATION,
        startTime: prepStartDate,
        endTime: prepEndDate,
        setId: randomSet.id,
      }).create()

      // Create Set Shoot event
      currentDate = prepEndDate.plus({ days: 1 }).startOf('day')
      const shootStartDate = this.getRandomStartDate(currentDate)
      const shootEndDate = this.getRandomEndDate(shootStartDate)
      await EventFactory.merge({
        locationId: location.id,
        type: EventType.SET_SHOOT,
        startTime: shootStartDate,
        endTime: shootEndDate,
        setId: randomSet.id,
      }).create()

      // Create Set Removal event
      currentDate = shootEndDate.plus({ days: 1 }).startOf('day')
      const removalStartDate = this.getRandomStartDate(currentDate)
      const removalEndDate = this.getRandomEndDate(removalStartDate)
      await EventFactory.merge({
        locationId: location.id,
        type: EventType.SET_REMOVAL,
        startTime: removalStartDate,
        endTime: removalEndDate,
        setId: randomSet.id,
      }).create()
    }
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
