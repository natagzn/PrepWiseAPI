import { DateTime } from 'luxon'
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Set from './Set'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public categoryId: number

  @column()
  public name: string

  @hasMany(() => Set, { foreignKey: 'categoryId' })
  public sets: HasMany<typeof Set>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
