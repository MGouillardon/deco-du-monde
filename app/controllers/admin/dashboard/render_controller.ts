import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'
import Set from '#models/set'
import Event from '#models/event'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class RenderController {
  async handle({ inertia }: HttpContext) {
    // Fetch overview statistics
    const totalItems = await Item.query().count('* as total')
    const totalSets = await Set.query().count('* as total')
    const upcomingShoots = await Event.query()
      .where('start_time', '>', DateTime.now().toSQL())
      .count('* as total')
    const itemsToPhotograph = await Item.query()
      .where('is_photographed_studio', false)
      .count('* as total')

    // Fetch recent activity
    const recentItems = await Item.query()
      .where('is_photographed_studio', true)
      .orderBy('updated_at', 'desc')
      .preload('itemStatus')
      .limit(5)
    const recentSets = await Set.query().orderBy('created_at', 'desc').limit(5)

    // Fetch upcoming event
    const upcomingEvent = await Event.query()
      .where('start_time', '>', DateTime.now().toSQL())
      .orderBy('start_time', 'asc')
      .preload('location')
      .preload('set')
      .limit(5)

    // Fetch status overview
    const itemStatusCounts = await db
      .from('items')
      .join('item_statuses', 'items.id', 'item_statuses.item_id')
      .select('item_statuses.status')
      .count('* as count')
      .groupBy('item_statuses.status')

    const setPhotographedCounts = await db
      .from('sets')
      .select(
        db.raw(
          "CASE WHEN is_photographed THEN 'Photographed' ELSE 'Not Photographed' END as status"
        )
      )
      .count('* as count')
      .groupBy('is_photographed')
      .then((results) =>
        results.map((row) => ({
          status: row.status,
          count: Number(row.count),
        }))
      )

    return inertia.render('Admin/Dashboard/Index', {
      title: 'Dashboard',
      stats: {
        totalItems: totalItems[0].$extras.total,
        totalSets: totalSets[0].$extras.total,
        upcomingShoots: upcomingShoots[0].$extras.total,
        itemsToPhotograph: itemsToPhotograph[0].$extras.total,
      },
      recentActivity: {
        items: recentItems,
        sets: recentSets,
      },
      upcomingEvent,
      statusOverview: {
        itemStatus: itemStatusCounts,
        setPhotographed: setPhotographedCounts,
      },
    })
  }
}
