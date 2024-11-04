import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RequestForHelp from 'App/Models/RequestForHelp'
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
