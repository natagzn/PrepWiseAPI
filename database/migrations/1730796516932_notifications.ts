import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('type_id').unsigned().notNullable().references('id').inTable('types_notifications').onDelete('CASCADE')
      table.integer('answer_id').unsigned().references('id').inTable('help_answers').onDelete('SET NULL')
      table.integer('question_id').unsigned().references('id').inTable('request_for_helps').onDelete('SET NULL')
      table.date('date').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
