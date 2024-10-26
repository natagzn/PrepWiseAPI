import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Resource from './Resource'

export default class ResourceLike extends BaseModel {
  @column({ isPrimary: true })
  public resourceLikeId: number

  @column()
  public userId: number

  @column()
  public resourceId: number

  @column()
  public like: boolean

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Resource, { foreignKey: 'resourceId' })
  public resource: BelongsTo<typeof Resource>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
