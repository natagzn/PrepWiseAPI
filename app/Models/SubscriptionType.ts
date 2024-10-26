import { DateTime } from 'luxon'
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Subscription from './Subscription'

export default class SubscriptionType extends BaseModel {
  @column({ isPrimary: true })
  public subscriptionTypeId: number

  @column()
  public name: string

  @hasMany(() => Subscription, { foreignKey: 'typeId' })
  public subscriptions: HasMany<typeof Subscription>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
