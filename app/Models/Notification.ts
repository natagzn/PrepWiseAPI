import { DateTime } from 'luxon'
import {  BaseModel, column, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import TypesNotification from './TypesNotification'
import HelpAnswer from './HelpAnswer'
import RequestForHelp from './RequestForHelp'



export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public typeId: number

  @column()
  public answerId: number | null

  @column()
  public questionId: number | null

  @column.date()
  public date: DateTime

  @belongsTo(() => TypesNotification)
  public type: BelongsTo<typeof TypesNotification>

  @belongsTo(() => HelpAnswer)
  public answer: BelongsTo<typeof HelpAnswer>

  @belongsTo(() => RequestForHelp)
  public question: BelongsTo<typeof RequestForHelp>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
