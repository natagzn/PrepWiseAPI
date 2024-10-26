import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Set from './Set'
import Folder from './Folder'
import Resource from './Resource'

export default class Favourite extends BaseModel {
  @column({ isPrimary: true })
  public favouriteId: number

  @column()
  public userId: number

  @column()
  public questionListId: number

  @column()
  public folderId: number

  @column()
  public resourceId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Set, { foreignKey: 'questionListId' })
  public set: BelongsTo<typeof Set>

  @belongsTo(() => Folder, { foreignKey: 'folderId' })
  public folder: BelongsTo<typeof Folder>

  @belongsTo(() => Resource, { foreignKey: 'resourceId' })
  public resource: BelongsTo<typeof Resource>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
