import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ResetCode extends BaseModel {
  public static table = 'codes'  // Додайте цей рядок

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public resetCode: string

  @column.dateTime()
  public expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
