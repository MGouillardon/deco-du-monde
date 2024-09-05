import Event from '#models/event'
import { DateTime } from 'luxon'

export class UpcomingEventService {
  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    return Event.query()
      .where('start_time', '>', DateTime.now().toSQL())
      .orderBy('start_time', 'asc')
      .preload('location')
      .preload('set')
      .limit(limit)
  }
}
