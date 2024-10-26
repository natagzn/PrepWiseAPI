import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'complaints'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('complaint_id').primary()
      table.integer('user_id').unsigned().references('users.user_id').onDelete('CASCADE')
      table.integer('user_id_compl').unsigned().references('users.user_id').onDelete('CASCADE')
      table.integer('resources_id').unsigned().references('resources.resources_id').onDelete('CASCADE')
      table.integer('set_id').unsigned().references('sets.question_set_id').onDelete('CASCADE')
      table.text('context').notNullable()
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
