import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Set from './Set'

export default class SharedSet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public setId: number

  @column()
  public userId: number

  @column()
  public edit: boolean

  @belongsTo(() => Set, { foreignKey: 'setId' })
  public set: BelongsTo<typeof Set>

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
