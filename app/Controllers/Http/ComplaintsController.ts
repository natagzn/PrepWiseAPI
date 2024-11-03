import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Complaint from 'App/Models/Complaint'

export default class ComplaintsController {
  // Створення скарги
  public async create({ request, auth, response }: HttpContextContract) {
    const userId = auth.user?.userId // Отримати ID поточного користувача
    const userIdCompl = request.input('userIdCompl')
    const resourcesId = request.input('resourcesId')
    const setId = request.input('setId')
    const context = request.input('context')

    // Перевірити, що хоча б одне з полів userIdCompl, resourcesId, setId заповнене
    if (!userIdCompl && !resourcesId && !setId) {
      return response.badRequest({ message: 'Принаймні одне з полів: userIdCompl, resourcesId, або setId повинно бути заповнене.' })
    }

    const complaint = await Complaint.create({
      userId: userId, // Заповнити ID поточного користувача
      userIdCompl,
      resourcesId,
      setId,
      context,
    })

    return response.created(complaint)
  }



  // Отримання всіх скарг
  public async index({ response }: HttpContextContract) {
    try {
      const complaints = await Complaint.query()
        .preload('user') // Попереднє завантаження інформації про користувача, який створив скаргу
        .preload('complainedUser') // Попереднє завантаження інформації про користувача, на якого подана скарга
        .preload('resource') // Попереднє завантаження інформації про ресурс, на який подана скарга
        .preload('set') // Попереднє завантаження інформації про набір, на який подана скарга
      return response.ok({ data: complaints })
    } catch (error) {
      return response.badRequest({ message: 'Failed to fetch complaints', error })
    }
  }

  // Отримання однієї скарги за ID
  public async show({ params, response }: HttpContextContract) {
    const complaint = await Complaint.find(params.id)

    if (!complaint) {
      return response.notFound({ message: 'Скаргу не знайдено.' })
    }

    return response.ok(complaint)
  }

  // Оновлення скарги
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const complaint = await Complaint.findOrFail(params.id)
      const data = request.only(['context'])
      complaint.merge(data)
      await complaint.save()
      return response.ok({ message: 'Complaint updated successfully', data: complaint })
    } catch (error) {
      return response.badRequest({ message: 'Failed to update complaint', error })
    }
  }

  // Видалення скарги
  public async delete({ params, response }: HttpContextContract) {
    try {
      const complaint = await Complaint.findOrFail(params.id)
      await complaint.delete()
      return response.ok({ message: 'Complaint deleted successfully' })
    } catch (error) {
      return response.badRequest({ message: 'Failed to delete complaint', error })
    }
  }
}
