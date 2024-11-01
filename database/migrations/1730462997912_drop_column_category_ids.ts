import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateResourcesAddCategoryId extends BaseSchema {
  protected tableName = 'resources'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Видаляємо старе поле category
      table.dropColumn('categoryId')
      })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Відновлюємо поле category у випадку скасування міграції
      table.string('category')
    })
  }
}
