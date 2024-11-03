import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HelpAnswer from 'App/Models/HelpAnswer'
import Friend from 'App/Models/People'
import Question from 'App/Models/Question'
import { DateTime } from 'luxon'

export default class HelpAnswersController {
  // Створення нової відповіді
  public async create({ request, response }: HttpContextContract) {
    try {
      const { friendId, questionId, content } = request.all()

      // Перевірка наявності friendId, questionId та content
      if (!friendId || !questionId || !content) {
        return response.badRequest({ message: 'friendId, questionId and content are required' })
      }

      // Перевірка, чи існує друг з таким ID
      const friendExists = await Friend.find(friendId)
      if (!friendExists) {
        return response.badRequest({ message: 'Friend with the specified ID does not exist' })
      }

      // Перевірка, чи існує питання з таким ID
      const questionExists = await Question.find(questionId)
      if (!questionExists) {
        return response.badRequest({ message: 'Question with the specified ID does not exist' })
      }

      const helpAnswer = await HelpAnswer.create({
        friendId,
        questionId,
        content,
        date: DateTime.local(), // Використовуємо Luxon для отримання поточної дати
      })

      return response.created({ message: 'Help answer created successfully', helpAnswer })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to create help answer', error: error.message })
    }
  }


  public async show({ params, response }: HttpContextContract) {
    try {
      const questionId = params.id

      // Отримання питання за ID
      const question = await Question.find(questionId)
      if (!question) {
        return response.notFound({ message: 'Question not found' })
      }

      // Отримання відповідей на це питання
      const helpAnswers = await HelpAnswer.query()
        .where('questionId', questionId)
        .preload('friend') // завантажуємо інформацію про друга (користувача), який надав відповідь

      return response.ok({ question, helpAnswers })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to retrieve question and help answers', error: error.message })
    }
  }
}
