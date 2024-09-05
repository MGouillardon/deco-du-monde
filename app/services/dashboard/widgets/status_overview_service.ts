import db from '@adonisjs/lucid/services/db'

export interface StatusCount {
  status: string
  count: number
}

export interface StatusOverview {
  itemStatus: StatusCount[]
  setPhotographed: StatusCount[]
}

export class StatusOverviewService {
  async getStatusOverview(): Promise<StatusOverview> {
    const [itemStatusCounts, setPhotographedCounts] = await Promise.all([
      db
        .from('items')
        .join('item_statuses', 'items.id', 'item_statuses.item_id')
        .select('item_statuses.status')
        .count('* as count')
        .groupBy('item_statuses.status'),
      db
        .from('sets')
        .select(
          db.raw(
            "CASE WHEN is_photographed THEN 'Photographed' ELSE 'Not Photographed' END as status"
          )
        )
        .count('* as count')
        .groupBy('is_photographed'),
    ])

    return {
      itemStatus: itemStatusCounts.map((row) => ({
        status: row.status,
        count: Number(row.count),
      })),
      setPhotographed: setPhotographedCounts.map((row) => ({
        status: row.status,
        count: Number(row.count),
      })),
    }
  }
}
