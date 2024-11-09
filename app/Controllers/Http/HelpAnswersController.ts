import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HelpAnswer from 'App/Models/HelpAnswer'
import Question from 'App/Models/Question'
import { DateTime } from 'luxon'

export default class HelpAnswersController {
  /**
   * @swagger
   * /api/help-answers:
   *   post:
   *     summary: Create a new help answer (поточний користувач дає відповідь на питання)
   *     tags: [HelpAnswers]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               questionId:
   *                 type: integer
   *                 description: The ID of the question being answered
   *               content:
   *                 type: string
   *                 description: The content of the answer
   *     responses:
   *       201:
   *         description: Help answer created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 helpAnswer:
   *                   $ref: '#/components/schemas/HelpAnswer'
   *       400:
   *         description: Bad request due to missing parameters or invalid IDs
   *       500:
   *         description: Internal server error
   */
  // Створення нової відповіді
  public async create({auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      const friendId = user.userId;

      const {questionId, content } = request.all()

      // Перевірка наявності friendId, questionId та content
      if (!friendId || !questionId || !content) {
        return response.badRequest({ message: 'friendId, questionId and content are required' })
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





  /**
   * @swagger
   * /api/help-answers/{id}:
   *   get:
   *     summary: Retrieve help answers for a specific question
   *     tags: [HelpAnswers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the question
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Successfully retrieved question and help answers
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 question:
   *                   $ref: '#/components/schemas/Question'
   *                 helpAnswers:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/HelpAnswer'
   *       404:
   *         description: Question not found
   *       500:
   *         description: Internal server error
   */
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
