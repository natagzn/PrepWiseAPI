import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'questions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('question_id').primary()
      table.integer('list_id').unsigned().references('sets.question_set_id').onDelete('CASCADE')
      table.boolean('status').notNullable()
      table.string('content', 2048).notNullable()
      table.string('answer', 2048).notNullable()
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
