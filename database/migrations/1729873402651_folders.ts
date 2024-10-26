import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'folders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('folder_id').primary()
      table.integer('user_id').unsigned()//.references('user_id').inTable('users').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.dateTime('date').notNullable()
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
