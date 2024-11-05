import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TypeNotification from 'App/Models/TypesNotification'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class TypesNotificationsController {
  /**
   * GET /types_notifications - отримати всі записи
   */
  public async index({ response }: HttpContextContract) {
    const types = await TypeNotification.all()
    return response.status(200).json({ data: types })
  }

  /**
   * POST /types_notifications - створити новий тип сповіщення
   */
  public async create({ request, response }: HttpContextContract) {
    const typeNotificationSchema = schema.create({
      name: schema.string(),
    })

    const payload = await request.validate({ schema: typeNotificationSchema })

    const type = await TypeNotification.create(payload)
    return response.status(201).json({
      message: 'TypeNotification created successfully',
      data: type,
    })
  }

  /**
   * GET /types_notifications/:id - отримати тип сповіщення за ID
   */
  public async show({ params, response }: HttpContextContract) {
    const type = await TypeNotification.find(params.id)
    if (!type) {
      return response.status(404).json({ message: 'TypeNotification not found' })
    }
    return response.status(200).json({ data: type })
  }

  /**
   * PUT /types_notifications/:id - оновити тип сповіщення за ID
   */
  public async update({ params, request, response }: HttpContextContract) {
    const type = await TypeNotification.find(params.id)
    if (!type) {
      return response.status(404).json({ message: 'TypeNotification not found' })
    }

    const updateSchema = schema.create({
      name: schema.string(),
    })

    const payload = await request.validate({ schema: updateSchema })

    type.merge(payload)
    await type.save()

    return response.status(200).json({
      message: 'TypeNotification updated successfully',
      data: type,
    })
  }

  /**
   * DELETE /types_notifications/:id - видалити тип сповіщення за ID
   */
  public async destroy({ params, response }: HttpContextContract) {
    const type = await TypeNotification.find(params.id)
    if (!type) {
      return response.status(404).json({ message: 'TypeNotification not found' })
    }

    await type.delete()
    return response.status(200).json({ message: 'TypeNotification deleted successfully' })
  }
}
