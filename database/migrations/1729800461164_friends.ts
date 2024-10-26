import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'friends'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('friend_id').primary()
      table.integer('user_id').unsigned()//.references('user_id').inTable('users').onDelete('CASCADE')
      table.integer('friend_user_id').unsigned()//.references('user_id').inTable('users').onDelete('CASCADE')
      table.integer('status_id').unsigned()//.references('status_id').inTable('status').onDelete('CASCADE')
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
