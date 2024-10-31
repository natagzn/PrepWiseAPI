import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm' // Імпорт BelongsTo
import User from './User'

export default class People extends BaseModel {
  public static table = 'people';  // Замість 'friends'

  @column({ isPrimary: true })
  public peopleId: number

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
