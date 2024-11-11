import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'code_for_new_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
      table.string('reset_code')
      table.timestamp('expires_at') // Час, коли код скидання пароля спливає
      table.timestamp('created_at').defaultTo(this.now()) // Час створення коду
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
