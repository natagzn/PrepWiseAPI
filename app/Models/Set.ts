import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Level from './Level'
import Question from './Question'


export default class Set extends BaseModel {
  @column({ isPrimary: true })
  public QuestionSet_id: number

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  public access: boolean

  @column.date()
  public data: DateTime

  @column()
  public levelId: number | null

  @column()
  public shared: boolean

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User> 

//////////////////////////////////////

  @belongsTo(() => Level, { foreignKey: 'levelId' })
  public level: BelongsTo<typeof Level>

  @hasMany(() => Question, { foreignKey: 'listId' }) // Зв'язок з питаннями
  public questions: HasMany<typeof Question>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
