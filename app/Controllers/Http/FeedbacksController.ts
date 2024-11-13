import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Feedback from 'App/Models/Feedback'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'


/**
 * @swagger
 * tags:
 *   name: Feedbacks
 *   description: API для роботи зі зворотним зв'язком
 */
export default class FeedbacksController {
    /**
   * @swagger
   * /api/feedback:
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


  /**
 * @swagger
 * /api/feedback-all:
 *   get:
 *     summary: "Отримати статистику відгуків за поточний місяць"
 *     tags:
 *       - Feedbacks
 *     description: |
 *       Цей метод повертає статистику відгуків за поточний місяць:
 *       - Загальна кількість відгуків, залишених протягом поточного місяця.
 *       - Кількість відгуків, залишених кожного дня протягом поточного місяця.
 *     responses:
 *       '200':
 *         description: "Статистика відгуків успішно отримана."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalFeedbacks:
 *                   type: integer
 *                   description: |
 *                     Загальна кількість відгуків, залишених у поточному місяці.
 *                     Це число відображає загальну кількість відгуків, зареєстрованих
 *                     з початку поточного місяця.
 *                 dailyFeedbacks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: |
 *                           Дата, коли був залишений відгук.
 *                       count:
 *                         type: integer
 *                         description: |
 *                           Кількість відгуків, залишених на кожен конкретний день
 *                           протягом поточного місяця.
 *       '400':
 *         description: "Некоректний запит або відсутність даних."
 *       '500':
 *         description: "Помилка серверу при обробці запиту."
 */


  public async getMonthlyFeedbacks() {
    // Визначаємо перший день і останній день поточного місяця
    const startOfMonth = DateTime.local().startOf('month')
    const endOfMonth = DateTime.local().endOf('month')
  
    // Загальна кількість підписок в поточному місяці
    const totalFeedbacks = await Feedback.query()
      .whereBetween('createdAt', [startOfMonth.toISO(), endOfMonth.toISO()])
      .count('* as total')
  
      const totalCount = totalFeedbacks[0]?.$extras?.total ?? 0
  
    // Кількість підписок за днями в поточному місяці
    const feedbacksByDay = await Database
    .from('feedbacks')
    .whereBetween('created_at', [startOfMonth.toSQL(), endOfMonth.toSQL()])
    .select(Database.raw('DATE(created_at) as date'))
    .count('* as count')
    .groupByRaw('DATE(created_at)')  // Додаємо це поле в групування
    .orderBy('date', 'asc')
  
  
    return {
      totalFeedbacks: totalCount,
      dailyFeedbacks: feedbacksByDay.map((row) => ({
        date: row.date,
        count: row.count,
      })),
    }
  }
}
