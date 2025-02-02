import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Friend from './User'
import Question from './Question'

export default class RequestForHelp extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public friendId: number

  @column()
  public questionId: number

  @column.dateTime()
  public date: DateTime

  @belongsTo(() => Friend, { foreignKey: 'friendId' })
  public friend: BelongsTo<typeof Friend>

  @belongsTo(() => Question, { foreignKey: 'questionId' })
  public question: BelongsTo<typeof Question>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
