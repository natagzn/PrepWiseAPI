import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateForeignKeys extends BaseSchema {
  protected tableName = 'help_answers' // Ви можете зазначити одну з таблиць, якщо зміни будуть вноситись до кількох

  public async up () {
    this.schema.alterTable('help_answers', (table) => {
      // Видалення старих зовнішніх ключів
      //table.dropForeign('help_answers_friend_id_foreign') // Видаляємо зв'язок, де friend_id відноситься до People.id

      // Створення нових зв'язків
      table.foreign('friend_id').references('user_id').inTable('users').onDelete('CASCADE') // Зв'язок з Users
    })

    this.schema.alterTable('request_for_helps', (table) => {
      // Видалення старих зовнішніх ключів
      //table.dropForeign('request_for_helps_friend_id_foreign') // Видаляємо старий зв'язок до People.id (якщо він існує)

      // Створення нових зв'язків
      table.foreign('friend_id').references('user_id').inTable('users').onDelete('CASCADE') // Зв'язок з Users
    })
  }

  public async down () {
    this.schema.alterTable('help_answers', (table) => {
      // Видалення нових зв'язків
      table.dropForeign('friend_id')

      // Відновлення старих зв'язків
      table.foreign('friend_id').references('id').inTable('people').onDelete('CASCADE')
    })

    this.schema.alterTable('request_for_help', (table) => {
      // Видалення нових зв'язків
      table.dropForeign('friend_id')

      // Відновлення старих зв'язків
      table.foreign('friend_id').references('id').inTable('people').onDelete('CASCADE')
    })
  }
}
