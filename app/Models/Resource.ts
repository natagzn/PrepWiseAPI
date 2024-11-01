import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Level from './Level'
import ResourceLike from './ResourceLike'
import Category from './Category'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  public resourceId: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public levelId: number
  
  @column()
  public categoryId: number

  @column.dateTime({ autoCreate: true })
  public data: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Level, { foreignKey: 'levelId' })
  public level: BelongsTo<typeof Level>

  @hasMany(() => ResourceLike, { foreignKey: 'resourceId' })
  public likes: HasMany<typeof ResourceLike>

  @belongsTo(() => Category, { foreignKey: 'categoryId' })
  public category: BelongsTo<typeof Category>



  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
