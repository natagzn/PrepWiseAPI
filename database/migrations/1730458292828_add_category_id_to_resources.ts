import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'resources'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // Додаємо поле category_id і встановлюємо зв'язок
      table
        .integer('category_id')
        .unsigned()
        .references('category_id')
        .inTable('categories')
        .onDelete('CASCADE') // Видалення ресурсів при видаленні категорії
        .after('level_id')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('category_id')
    })
  }
}
