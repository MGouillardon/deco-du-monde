import { ScheduleType } from '#enums/schedule_type'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('location_id').unsigned().references('id').inTable('locations')
      table.dateTime('start_time').notNullable()
      table.dateTime('end_time').notNullable()
      table.enum('type', Object.values(ScheduleType)).notNullable()
      table.integer('set_id').unsigned().references('id').inTable('sets').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
