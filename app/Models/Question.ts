import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Set from './Set'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  public questionId: number

  @column()
  public listId: number

  @column()
  public status: boolean

  @column()
  public content: string

  @column()
  public answer: string

  @belongsTo(() => Set, { foreignKey: 'listId' })
  public set: BelongsTo<typeof Set>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
