import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'resources'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('resource_id').primary()
      table.integer('user_id').unsigned().references('user_id').inTable('users').onDelete('CASCADE')
      table.string('title', 255).notNullable()
      table.string('description', 1024).notNullable()
      table.integer('level_id').unsigned().references('level_id').inTable('levels').onDelete('SET NULL')
      table.string('category', 255).notNullable()
      table.dateTime('data').notNullable()
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
