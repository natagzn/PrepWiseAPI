import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Friend from './Friend'


export default class Status extends BaseModel {
  @column({ isPrimary: true })
  public statusId: number

  @column()
  public name: string

  @hasMany(() => Friend, { foreignKey: 'statusId' })
  public friends: HasMany<typeof Friend> 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
