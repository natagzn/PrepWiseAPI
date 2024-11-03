import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateResourcesAddCategoryId extends BaseSchema {
  protected tableName = 'resources'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Видаляємо старе поле category
      table.dropColumn('category')
      
      // Додаємо нове поле categoryId і встановлюємо зв'язок з таблицею categories
      table.integer('categoryId').unsigned().references('category_id').inTable('categories').onDelete('CASCADE').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Відновлюємо поле category у випадку скасування міграції
      table.string('category')

      // Видаляємо поле categoryId
      table.dropColumn('categoryId')
    })
  }
}
