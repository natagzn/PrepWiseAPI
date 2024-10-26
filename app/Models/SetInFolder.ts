import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Folder from './Folder'
import Set from './Set'

export default class SetInFolder extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public setId: number

  @column()
  public folderId: number

  @belongsTo(() => Set, { foreignKey: 'setId' })
  public set: BelongsTo<typeof Set>

  @belongsTo(() => Folder, { foreignKey: 'folderId' })
  public folder: BelongsTo<typeof Folder>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
