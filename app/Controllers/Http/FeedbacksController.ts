import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Feedback from 'App/Models/Feedback'


/**
 * @swagger
 * tags:
 *   name: Feedbacks
 *   description: API для роботи зі зворотним зв'язком
 */
export default class FeedbacksController {
    /**
   * @swagger
   * /api/feedbacks:
   *   post:
   *     summary: Створити новий зворотний зв'язок
   *     tags: [Feedbacks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *                 description: Вміст зворотного зв'язку
   *                 example: "Це мій відгук."
   *               imageUrl:
   *                 type: string
   *                 description: URL зображення, що додається до зворотного зв'язку
   *                 example: "http://example.com/image.jpg"
   *     responses:
   *       201:
   *         description: Зворотний зв'язок успішно створено
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Feedback'
   *       400:
   *         description: Невірний запит
   *       500:
   *         description: Помилка сервера
   */
  public async store({auth, request, response }: HttpContextContract) {
    const {content, imageUrl } = request.all()
    const userId = auth.user?.userId

    const feedback = await Feedback.create({
      userId,
      content,
      imageUrl,
    })

    return response.status(201).json(feedback)
  }


  /**
   * @swagger
   * /api/feedback:
   *   get:
   *     summary: Get all feedback records
   *     description: Retrieve a list of all feedback records, including associated user information (username, id, email).
   *     tags:
   *       - Feedbacks
   *     responses:
   *       200:
   *         description: A list of feedback records
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   feedbackId:
   *                     type: integer
   *                     description: Unique identifier of the feedback
   *                   userId:
   *                     type: integer
   *                     description: ID of the user who gave the feedback
   *                   content:
   *                     type: string
   *                     description: The content of the feedback
   *                   imageUrl:
   *                     type: string
   *                     description: URL of the feedback image (optional)
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                     description: Timestamp when the feedback was created
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *                     description: Timestamp when the feedback was last updated
   *                   user:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         description: User ID
   *                       username:
   *                         type: string
   *                         description: Username of the user
   *                       email:
   *                         type: string
   *                         description: Email of the user
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 error:
   *                   type: string
   */
  public async index({ response }: HttpContextContract) {
    try {
      // Отримуємо всі записи з таблиці Feedback, завантажуємо лише потрібні поля з користувача
      const feedbacks = await Feedback.query()
        .preload('user', (userQuery) => {
          userQuery.select('user_id', 'username', 'email') // Вибираємо тільки id, username, email
        })

      return response.ok(feedbacks)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to retrieve feedbacks',
        error: error.message,
      })
    }
  }
}
