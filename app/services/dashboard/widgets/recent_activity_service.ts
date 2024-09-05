import Item from '#models/item'
import Set from '#models/set'

export interface RecentActivity {
  items: Item[]
  sets: Set[]
}

export class RecentActivityService {
  async getRecentActivity(limit: number = 5): Promise<RecentActivity> {
    const [items, sets] = await Promise.all([
      Item.query()
        .where('is_photographed_studio', true)
        .orderBy('updated_at', 'desc')
        .preload('itemStatus')
        .limit(limit),
      Set.query().orderBy('created_at', 'desc').limit(limit),
    ])

    return { items, sets }
  }
}
