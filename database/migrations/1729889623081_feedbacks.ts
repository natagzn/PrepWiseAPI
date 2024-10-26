import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'feedbacks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('feedback_id').primary()
      table.integer('user_id').unsigned().references('users.user_id').onDelete('CASCADE')
      table.string('content', 1024).notNullable()
      table.string('image_url', 255).nullable()
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
