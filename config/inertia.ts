import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'
import AuthorizationService from '#services/authorization_service'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    auth: async (ctx) => {
      const user = ctx.auth?.user
      if (!user) {
        return null
      }

      const authService = await ctx.containerResolver.make(AuthorizationService)
      return {
        ...user,
        can: authService.getUserPermissions(user),
      }
    },
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    success: (ctx) => ctx.session?.flashMessages.get('success'),
    info: (ctx) => ctx.session?.flashMessages.get('info'),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.ts',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
