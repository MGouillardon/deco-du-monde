import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DashboardStatsService } from '#services/dashboard/widgets/stats_service'
import { RecentActivityService } from '#services/dashboard/widgets/recent_activity_service'
import { UpcomingEventService } from '#services/dashboard/widgets/upcoming_event_service'
import { StatusOverviewService } from '#services/dashboard/widgets/status_overview_service'

@inject()
export default class RenderController {
  constructor(
    private dashboardStatsService: DashboardStatsService,
    private recentActivityService: RecentActivityService,
    private upcomingEventService: UpcomingEventService,
    private statusOverviewService: StatusOverviewService
  ) {}

  async handle({ inertia }: HttpContext) {
    try {
      const [stats, recentActivity, upcomingEvents, statusOverview] = await Promise.all([
        this.dashboardStatsService.getStats(),
        this.recentActivityService.getRecentActivity(),
        this.upcomingEventService.getUpcomingEvents(),
        this.statusOverviewService.getStatusOverview(),
      ])

      return inertia.render('Admin/Dashboard/Index', {
        title: 'Dashboard',
        stats,
        recentActivity,
        upcomingEvents,
        statusOverview,
      })
    } catch (error) {
      console.error(error)
    }
  }
}
