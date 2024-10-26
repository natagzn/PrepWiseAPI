import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('subscription_id').primary()
      table.integer('type_id').unsigned()//.references('subscriptions_type.subscriptions_type_id').onDelete('CASCADE')
      table.integer('user_id').unsigned()//.references('users.user_id').onDelete('CASCADE')
      table.date('date').notNullable()
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
