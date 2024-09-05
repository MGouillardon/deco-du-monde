import Item from '#models/item'
import Set from '#models/set'
import Event from '#models/event'
import { DateTime } from 'luxon'

export interface DashboardStats {
  totalItems: number
  totalSets: number
  upcomingShoots: number
  itemsToPhotograph: number
}

export class DashboardStatsService {
  async getStats(): Promise<DashboardStats> {
    const [totalItems, totalSets, upcomingShoots, itemsToPhotograph] = await Promise.all([
      Item.query().count('* as total').first(),
      Set.query().count('* as total').first(),
      Event.query().where('start_time', '>', DateTime.now().toSQL()).count('* as total').first(),
      Item.query().where('is_photographed_studio', false).count('* as total').first(),
    ])

    return {
      totalItems: Number(totalItems?.$extras.total || 0),
      totalSets: Number(totalSets?.$extras.total || 0),
      upcomingShoots: Number(upcomingShoots?.$extras.total || 0),
      itemsToPhotograph: Number(itemsToPhotograph?.$extras.total || 0),
    }
  }
}
