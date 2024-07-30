import { LocationType } from '#enums/location_type'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'item_validations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('item_id').unsigned().notNullable()
      table.integer('user_id').unsigned().nullable()
      table.enum('type', Object.values(LocationType)).notNullable()
      table.boolean('is_validated').defaultTo(false)
      table.timestamp('validated_at').nullable()
      table.timestamp('created_at').notNullable()
      table.unique(['item_id', 'user_id'])
      table.foreign('item_id').references('id').inTable('items').onDelete('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
