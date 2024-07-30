import { SetValidationType } from '#enums/set_validation_type'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'set_validations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('set_id').unsigned().references('id').inTable('sets')
      table.integer('user_id').unsigned().references('id').inTable('users').nullable()
      table.enum('type', Object.values(SetValidationType)).notNullable()
      table.boolean('is_validated').defaultTo(false)
      table.timestamp('validated_at').nullable()
      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
