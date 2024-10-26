import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import SetInFolder from './SetInFolder'

export default class Folder extends BaseModel {
  @column({ isPrimary: true })
  public folderId: number

  @column()
  public userId: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public date: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @hasMany(() => SetInFolder, { foreignKey: 'folderId' })
  public setsInFolder: HasMany<typeof SetInFolder>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
