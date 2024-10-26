import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Category from './Category'
import Level from './Level'


export default class Set extends BaseModel {
  @column({ isPrimary: true })
  public questionSetId: number

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  public categoryId: number | null

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




  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
