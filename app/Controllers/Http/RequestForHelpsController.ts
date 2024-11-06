import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RequestForHelp from 'App/Models/RequestForHelp'
import People from 'App/Models/People'

import { DateTime } from 'luxon'


export default class RequestForHelpController {
  /**
   * @swagger
   * /api/requests-for-help:
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
}
