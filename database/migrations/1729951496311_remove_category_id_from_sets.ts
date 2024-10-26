import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RemoveCategoryIdFromSets extends BaseSchema {
  protected tableName = 'sets'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('category_id')  // Видаляємо поле category_id
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.integer('category_id').unsigned().references('category_id').inTable('categories')  // Додаємо поле назад при відкаті
    })
  }
}
