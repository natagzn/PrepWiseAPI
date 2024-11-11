import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HelpAnswer from 'App/Models/HelpAnswer'
import Question from 'App/Models/Question'
import User from 'App/Models/User'

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
   * /api/help-answers-for-questions/{id}:
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

    // Формування кінцевої відповіді з потрібними полями
    const formattedAnswers = await Promise.all(
      helpAnswers.map(async (answer) => {
        // Знайти користувача за friendId для отримання username
        const user = await User.find(answer.friendId)
        return {
          friendId: user?.userId,
          username: user?.username,
          content: answer.content,
          date: answer.createdAt,
        }
      })
    )

    return response.ok({
      question: {
        id: question.questionId,
        title: question.content,
        createdAt: question.createdAt,
      },
      helpAnswers: formattedAnswers,
    })
      } catch (error) {
      return response.internalServerError({ message: 'Failed to retrieve question and help answers', error: error.message })
    }
  }



/**
 * @swagger
 * /api/help-answers/{id}:
 *   get:
 *     summary: Get HelpAnswer by ID
 *     description: Отримує запис HelpAnswer за його ID разом зі зв'язаними даними friend і question.
 *     tags:
 *       - HelpAnswers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Унікальний ідентифікатор HelpAnswer
 *     responses:
 *       200:
 *         description: Успішно отримано запис HelpAnswer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     friendId:
 *                       type: integer
 *                       example: 2
 *                     questionId:
 *                       type: integer
 *                       example: 3
 *                     content:
 *                       type: string
 *                       example: "This is the answer content"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-11-11"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-11T12:34:56Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-11T12:34:56Z"
 *                     friend:
 *                       type: object
 *                       description: Зв'язаний об'єкт Friend
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     question:
 *                       type: object
 *                       description: Зв'язаний об'єкт Question
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *       404:
 *         description: HelpAnswer не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "HelpAnswer not found"
 *       500:
 *         description: Виникла помилка при отриманні HelpAnswer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch HelpAnswer"
 *                 error:
 *                   type: string
 */

  public async get({ params, response }: HttpContextContract) {
    try {
      // Пошук HelpAnswer за ID з підвантаженням зв'язаних friend та question
      const helpAnswer = await HelpAnswer.query()
      .where('id', params.id)
      .preload('question', (questionQuery) => {
        questionQuery.preload('set', (setQuery) => {
          setQuery.preload('user')  // Завантажуємо інформацію про автора сету
        })
      })
      .preload('friend')  // Також завантажуємо інформацію про друга, який надіслав запит
      .first()

      if (!helpAnswer) {
        return response.status(404).json({ message: 'HelpAnswer not found' })
      }

      return response.status(200).json({ data: helpAnswer })
    } catch (error) {
      console.error('Error fetching HelpAnswer:', error)
      return response.status(500).json({ message: 'Failed to fetch HelpAnswer', error: error.message })
    }
  }
}
