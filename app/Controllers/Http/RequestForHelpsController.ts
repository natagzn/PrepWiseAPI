import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RequestForHelp from 'App/Models/RequestForHelp'
import { DateTime } from 'luxon'


export default class RequestForHelpController {
  // Створення нового запиту на допомогу
  public async create({ request, response }: HttpContextContract) {
    try {
      const { friendId, questionId } = request.all()

      // Перевірка наявності friendId та questionId
      if (!friendId || !questionId) {
        return response.badRequest({ message: 'friendId and questionId are required' })
      }

      const requestForHelp = await RequestForHelp.create({
        friendId,
        questionId,
        date: DateTime.local(), 
      })

      return response.created({ message: 'Request for help created successfully', requestForHelp })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to create request for help', error: error.message })
    }
  }
}
