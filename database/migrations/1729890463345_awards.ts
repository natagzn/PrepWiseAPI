import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'awards'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('award_id').primary()
      table.integer('user_id').unsigned()//.references('users.user_id').onDelete('CASCADE')
      table.integer('type_id').unsigned()//.references('types_awards.typeAward_id').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
