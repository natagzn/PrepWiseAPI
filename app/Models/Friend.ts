import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm' // Імпорт BelongsTo
import User from './User'
import Status from './Status'

export default class Friend extends BaseModel {
  @column({ isPrimary: true })
  public friendId: number

  @column()
  public userId: number

  @column()
  public friendUserId: number

  @column()
  public statusId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User> // Оновлено тип

  @belongsTo(() => User, { foreignKey: 'friendUserId' })
  public friendUser: BelongsTo<typeof User> // Оновлено тип

  @belongsTo(() => Status)
  public status: BelongsTo<typeof Status> // Оновлено тип

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
