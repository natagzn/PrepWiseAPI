import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SharedSet from 'App/Models/SharedSet'

export default class SharedSetsController {
  // Створення нового запису
  public async create({ request, response }: HttpContextContract) {
    try {
      const { setId, userId, edit } = request.all()

      const isEdit = edit === 'true' || edit === true;

      const sharedSet = await SharedSet.create({
        setId,
        userId,
        edit: isEdit,
      })

      return response.created({ message: 'SharedSet created successfully', sharedSet })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to create SharedSet', error: error.message })
    }
  }

  // Отримання всіх записів
  public async index({ response }: HttpContextContract) {
    try {
      const sharedSets = await SharedSet.all()
      return response.ok({ message: 'SharedSets retrieved successfully', sharedSets })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to retrieve SharedSets', error: error.message })
    }
  }

  // Отримання одного запису
  public async show({ params, response }: HttpContextContract) {
    try {
      const sharedSet = await SharedSet.find(params.id)

      if (!sharedSet) {
        return response.notFound({ message: 'SharedSet not found' })
      }

      return response.ok({ message: 'SharedSet retrieved successfully', sharedSet })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to retrieve SharedSet', error: error.message })
    }
  }

  // Оновлення запису
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const sharedSet = await SharedSet.find(params.id)
  
      if (!sharedSet) {
        return response.notFound({ message: 'SharedSet not found' })
      }
  
      const { edit } = request.all()
  
      // Перетворюємо значення edit на boolean
      const isEdit = edit === 'true' || edit === true;
  
      // Обновлюємо поле edit
      sharedSet.merge({
        ...request.all(),
        edit: isEdit,
      });
  
      await sharedSet.save()
  
      return response.ok({ message: 'SharedSet updated successfully', sharedSet })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to update SharedSet', error: error.message })
    }
  }

  // Видалення запису
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const sharedSet = await SharedSet.find(params.id)

      if (!sharedSet) {
        return response.notFound({ message: 'SharedSet not found' })
      }

      await sharedSet.delete()
      return response.status(200).json({ message: 'SharedSet deleted successfully' })
      //return response.noContent({ message: 'SharedSet deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to delete SharedSet', error: error.message })
    }
  }

  // Запит для отримання ID автора поширеного сету
  public async getAuthorId({ params, response }: HttpContextContract) {
    try {
      const sharedSet = await SharedSet.query()
        .where('id', params.id)
        .preload('set', (query) => {
          query.preload('user')
        })
        .first()

      if (!sharedSet || !sharedSet.set) {
        return response.notFound({ message: 'SharedSet or associated Set not found' })
      }

      const authorId = sharedSet.set.userId
      return response.ok({ message: 'Author ID retrieved successfully', authorId })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to retrieve author ID', error: error.message })
    }
  }
}
