import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import TypeAward from './TypesAward'

export default class Award extends BaseModel {
  @column({ isPrimary: true })
  public awardId: number

  @column()
  public userId: number

  @column()
  public typeId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => TypeAward, { foreignKey: 'typeId' })
  public typeAward: BelongsTo<typeof TypeAward>
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
