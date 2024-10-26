import { DateTime } from 'luxon'
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Set from './Set'
import Resource from './Resource'

export default class Level extends BaseModel {
  @column({ isPrimary: true })
  public levelId: number

  @column()
  public name: string

  @hasMany(() => Set, { foreignKey: 'levelId' })
  public sets: HasMany<typeof Set>

  @hasMany(() => Resource, { foreignKey: 'levelId' })
  public resources: HasMany<typeof Resource>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
