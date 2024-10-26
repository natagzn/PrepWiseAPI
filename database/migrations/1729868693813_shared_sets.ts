import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'shared_sets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('set_id').unsigned().references('question_set_id').inTable('sets').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('user_id').inTable('users').onDelete('CASCADE')
      table.boolean('edit').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
