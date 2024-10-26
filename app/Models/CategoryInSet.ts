import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Set from './Set'
import Category from './Category'

export default class CategoryInSet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public questionSetId: number

  @column()
  public categoryId: number

  @belongsTo(() => Set, { foreignKey: 'questionSetId' })
  public set: BelongsTo<typeof Set>

  @belongsTo(() => Category, { foreignKey: 'categoryId' })
  public category: BelongsTo<typeof Category>
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
