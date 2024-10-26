import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'favourites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('favourite_id').primary()
      table.integer('user_id').unsigned()//.references('users.user_id').onDelete('CASCADE')
      table.integer('question_list_id').unsigned()//.references('sets.question_set_id').onDelete('CASCADE')
      table.integer('folder_id').unsigned()//.references('folders.folder_id').onDelete('CASCADE')
      table.integer('resource_id').unsigned()//.references('resources.resources_id').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
