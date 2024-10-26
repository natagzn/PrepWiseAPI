import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import SubscriptionType from './SubscriptionType'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public subscriptionId: number

  @column()
  public typeId: number

  @column()
  public userId: number

  @column.dateTime()
  public date: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => SubscriptionType, { foreignKey: 'typeId' })
  public type: BelongsTo<typeof SubscriptionType>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
