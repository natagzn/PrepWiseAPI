import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RequestForHelp from 'App/Models/RequestForHelp'
import People from 'App/Models/People'

import { DateTime } from 'luxon'


export default class RequestForHelpController {
  /**
   * @swagger
   * /api/request-for-help:
   *   post:
   *     summary: Create a new request for help
   *     tags: [RequestsForHelp]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               friendId:
   *                 type: integer
   *                 description: ID of the friend to whom the request is directed.
   *               questionId:
   *                 type: integer
   *                 description: ID of the question related to the request.
   *     responses:
   *       201:
   *         description: Request for help created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Request for help created successfully
   *                 requestForHelp:
   *                   type: object
   *                   description: The created request for help object.
   *       400:
   *         description: Bad Request - Required fields missing
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: friendId and questionId are required
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Failed to create request for help
   *                 error:
   *                   type: string
   *                   example: Error details
   */
  // Створення нового запиту на допомогу
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const userId = auth.user?.userId
      const { friendId, questionId } = request.all()
  
      // Перевірка наявності friendId та questionId
      if (!friendId || !questionId || !userId) {
        return response.badRequest({ message: 'friendId and questionId are required' })
      }
  
      // Перевірка, чи існує взаємна підписка
      const mutualSubscriptionQuery = People.query()
        .where('userId', userId)
        .where('friendUserId', friendId)
        .whereIn('friendUserId', (subquery) => {
          subquery
            .from('people')
            .where('userId', friendId)
            .where('friendUserId', userId)
            .select('friendUserId')
        })
  
      console.log('Mutual Subscription Query:', mutualSubscriptionQuery.toQuery()) // Вивід SQL-запиту для взаємної підписки
  
      const mutualSubscription = await mutualSubscriptionQuery.first()
      console.log('Mutual Subscription Result:', mutualSubscription) // Вивід результату запиту
  
      /*if (!mutualSubscription) {
        return response.forbidden({ message: 'Mutual subscription is required to send a request for help' })
      }*/
  
      // Створення запису в таблиці RequestForHelp
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


/**
 * @swagger
 * /api/request-for-help/{id}:
 *   get:
 *     summary: Get RequestForHelp by ID
 *     description: Отримує запис RequestForHelp за його ID разом зі зв'язаними даними friend і question.
 *     tags:
 *       - RequestsForHelp
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Унікальний ідентифікатор RequestForHelp
 *     responses:
 *       200:
 *         description: Успішно отримано запис RequestForHelp
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
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-11T12:34:56Z"
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
 *         description: RequestForHelp не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "RequestForHelp not found"
 *       500:
 *         description: Виникла помилка при отриманні RequestForHelp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch RequestForHelp"
 *                 error:
 *                   type: string
 */

public async get({ params, response }) {
  try {
    const request = await RequestForHelp.query()
      .where('id', params.id)
      .preload('question', (questionQuery) => {
        questionQuery.preload('set', (setQuery) => {
          setQuery.preload('user')  // Завантажуємо інформацію про автора сету
        })
      })
      .preload('friend')  // Також завантажуємо інформацію про друга, який надіслав запит
      .first()

    if (!request) {
      return response.status(404).json({
        message: 'Request not found'
      })
    }

    return response.status(200).json({
      status: 'success',
      data: request
    })
  } catch (error) {
    return response.status(500).json({
      message: 'An error occurred while fetching the request',
      error: error.message
    })
  }
}
}
