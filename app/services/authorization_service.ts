import User from '#models/user'
import Roles from '#enums/roles'

export default class AuthorizationService {
  isPhotographTeam(user: User): boolean {
    return [Roles.PHOTOGRAPH, Roles.ASSISTANT_PHOTOGRAPH].includes(user.roleId)
  }

  isDecoratorTeam(user: User): boolean {
    return [Roles.DECORATOR, Roles.ASSISTANT_DECORATOR].includes(user.roleId)
  }

  isManagementTeam(user: User): boolean {
    return [Roles.ADMIN, Roles.PHOTOGRAPH, Roles.DECORATOR].includes(user.roleId)
  }

  getUserPermissions(user: User) {
    return {
      viewDashboard: this.isManagementTeam(user),
      viewUsers: user.roleId === Roles.ADMIN,
      viewWork: this.isManagementTeam(user),
      viewReports: this.isManagementTeam(user),
      validatePhotos: this.isPhotographTeam(user),
      validateSets: this.isDecoratorTeam(user),
    }
  }
}
