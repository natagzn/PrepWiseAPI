import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.increments('QuestionSet_id').primary()
      table.integer('user_id').unsigned()//.references('user_id').inTable('users').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.integer('category_id').unsigned()//.references('category_id').inTable('categories').onDelete('SET NULL')
      table.boolean('access').notNullable().defaultTo(false)
      table.date('data').notNullable()
      table.integer('level_id').unsigned()//.references('level_id').inTable('levels').onDelete('SET NULL')
      table.boolean('shared').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
