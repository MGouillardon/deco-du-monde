import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'item_validations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('item_id').unsigned().references('id').inTable('items')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.boolean('is_validated').defaultTo(false)
      table.timestamp('validated_at').nullable()
      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
