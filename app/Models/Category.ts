import { DateTime } from 'luxon'
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Set from './Set'
import Resource from './Resource'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public categoryId: number

  @column()
  public name: string

  @hasMany(() => Set, { foreignKey: 'categoryId' })
  public sets: HasMany<typeof Set>


  @hasMany(() => Resource, { foreignKey: 'categoryId' })
  public resources: HasMany<typeof Resource> 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
