import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'resource_likes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('resource_like_id').primary()
      table.integer('user_id').unsigned().references('user_id').inTable('users').onDelete('CASCADE')
      table.integer('resource_id').unsigned().references('resource_id').inTable('resources').onDelete('CASCADE')
      table.boolean('like').notNullable()
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
