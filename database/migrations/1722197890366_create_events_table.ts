import { EventType } from '#enums/event_type'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('location_id')
        .unsigned()
        .references('id')
        .inTable('locations')
        .onDelete('CASCADE')
      table.dateTime('start_time').notNullable()
      table.dateTime('end_time').notNullable()
      table.enum('type', Object.values(EventType)).notNullable()
      table.boolean('completed').defaultTo(false)
      table.timestamp('completed_at').nullable()
      table
        .integer('set_id')
        .unsigned()
        .references('id')
        .inTable('sets')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('item_id')
        .unsigned()
        .references('id')
        .inTable('items')
        .onDelete('CASCADE')
        .nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
