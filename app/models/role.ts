import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  private static readonly displayNames: Record<string, string> = {
    chauffeur_assistant: 'Chauffeur Assistant',
    assistant_decorateur: 'Assistant Décorateur',
    décorateur: 'Décorateur',
    assistant_photographe: 'Assistant Photographe',
    photographe: 'Photographe',
  }

  @computed()
  get displayName() {
    return Role.getDisplayName(this.name)
  }

  static getDisplayName(name: string): string {
    return (
      this.displayNames[name] ||
      name
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    )
  }
}
