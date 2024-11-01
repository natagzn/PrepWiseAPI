import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Resource from 'App/Models/Resource'
import { DateTime } from 'luxon'

export default class ResourcesController {
  
  // Створення нового ресурсу
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const data = request.only(['title', 'description', 'levelId', 'category'])

      const resource = await Resource.create({
        ...data,
        userId: user.userId,
        data: DateTime.local() // Встановлюємо поточну дату
      })

      return response.status(201).json({ message: 'Resource created successfully', resource })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create resource', error })
    }
  }

  // Отримання всіх ресурсів
  public async index({ response }: HttpContextContract) {
    try {
      const resources = await Resource.query().preload('user').preload('level').preload('likes')
      return response.status(200).json(resources)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve resources', error })
    }
  }

  // Отримання ресурсу за ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const resource = await Resource.query()
        .where('resourceId', params.id)
        .preload('user')
        .preload('level')
        .preload('likes')
        .firstOrFail()

      return response.status(200).json(resource)
    } catch (error) {
      return response.status(404).json({ message: 'Resource not found', error })
    }
  }

  // Оновлення ресурсу
  public async update({ auth, params, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const resource = await Resource.findOrFail(params.id)

      if (resource.userId !== user.userId) {
        return response.status(403).json({ message: 'Unauthorized to update this resource' })
      }

      resource.merge(request.only(['title', 'description', 'levelId', 'category']))
      await resource.save()

      return response.status(200).json({ message: 'Resource updated successfully', resource })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update resource', error })
    }
  }

  // Видалення ресурсу
  public async delete({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const resource = await Resource.findOrFail(params.id)

      if (resource.userId !== user.userId) {
        return response.status(403).json({ message: 'Unauthorized to delete this resource' })
      }

      await resource.delete()

      return response.status(200).json({ message: 'Resource deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete resource', error })
    }
  }
}
