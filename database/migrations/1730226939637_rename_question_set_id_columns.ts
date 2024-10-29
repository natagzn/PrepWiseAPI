import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RenameQuestionSetIdColumn extends BaseSchema {
  protected tableName = 'sets'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('QuestionSet_id', 'question_set_id')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('question_set_id', 'QuestionSet_id')
    })
  }
}
