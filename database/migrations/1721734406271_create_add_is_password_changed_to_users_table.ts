import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_password_changed').defaultTo(false).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
