import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Resource from './Resource'
import Set from './Set'

export default class Complaint extends BaseModel {
  @column({ isPrimary: true })
  public complaintId: number

  @column()
  public userId: number

  @column()
  public userIdCompl: number

  @column()
  public resourcesId: number

  @column()
  public setId: number

  @column()
  public context: string

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'userIdCompl' })
  public complainedUser: BelongsTo<typeof User>

  @belongsTo(() => Resource, { foreignKey: 'resourcesId' })
  public resource: BelongsTo<typeof Resource>

  @belongsTo(() => Set, { foreignKey: 'setId' })
  public set: BelongsTo<typeof Set>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
