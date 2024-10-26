import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'help_answers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('friend_id').unsigned().references('friends.friend_id').onDelete('CASCADE')
      table.integer('question_id').unsigned().references('questions.question_id').onDelete('CASCADE')
      table.text('content').notNullable()
      table.date('date').notNullable()
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
