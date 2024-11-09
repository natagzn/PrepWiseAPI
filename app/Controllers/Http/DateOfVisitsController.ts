import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DateOfVisit from 'App/Models/DateOfVisit'
import { DateTime } from 'luxon'


export default class DateOfVisitsController {
  /**
   * @swagger
   * /api/date-of-visits:
   *   get:
   *     summary: Отримати всі записи про відвідини для поточного користувача
   *     tags: [DateOfVisits]
   *     description: Повертає список всіх записів про відвідини для користувача, визначеного по токену авторизації.
   *     responses:
   *       200:
   *         description: Успішно отримано записи про відвідини.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   dateOfVisitId:
   *                     type: integer
   *                     description: ID запису про відвідини.
   *                   userId:
   *                     type: integer
   *                     description: ID користувача.
   *                   date:
   *                     type: string
   *                     format: date
   *                     description: Дата відвідування.
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                     description: Дата створення запису.
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *                     description: Дата останнього оновлення запису.
   *       401:
   *         description: Необхідна аутентифікація.
   *       404:
   *         description: Записи не знайдено.
   */
  public async index({ auth, response }: HttpContextContract) {
    try {
      // Аутентифікація користувача
      const user = await auth.authenticate()

      // Отримуємо всі записи про відвідини для поточного користувача
      const visits = await DateOfVisit.query().where('userId', user.userId)

      // Перевіряємо, чи є записи
      if (visits.length === 0) {
        return response.status(404).json({ message: 'No visit records found' })
      }

      return response.status(200).json(visits)
    } catch (error) {
      return response.status(401).json({ message: 'Authentication required' })
    }
  }



  


  /**
   * @swagger
   * /api/date-of-visits/create:
   *   post:
   *     summary: Створює новий запис про дату відвідування для поточного користувача
   *     tags:
   *       - DateOfVisits
   *     security:
   *       - bearerAuth: []  # Потребує Bearer токена для авторизації
   *     responses:
   *       201:
   *         description: Успішно створено запис про відвідування
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Visit date created successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     dateOfVisitId:
   *                       type: integer
   *                       example: 1
   *                     userId:
   *                       type: integer
   *                       example: 5
   *                     date:
   *                       type: string
   *                       format: date
   *                       example: "2024-11-08"
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-11-08T12:34:56.000Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-11-08T12:34:56.000Z"
   *       401:
   *         description: Неавторизований запит, користувач не автентифікований
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Unauthorized
   *       500:
   *         description: Внутрішня помилка сервера при створенні запису
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error creating visit date
   *                 error:
   *                   type: string
   *                   example: "Internal server error details"
   */
  public async create({ auth, response }: HttpContextContract) {
    try {
      // Отримуємо поточного користувача
      const user = await auth.authenticate()
      
      // Створюємо новий запис про дату відвідування
      const newVisit = await DateOfVisit.create({
        userId: user.userId,      // ID поточного користувача
        date: DateTime.local(),   // Поточна дата та час
      })

      return response.status(201).json({
        message: 'Visit date created successfully',
        data: newVisit,
      })
    } catch (error) {
      console.error('Error creating visit date:', error)
      return response.status(500).json({
        message: 'Error creating visit date',
        error: error.message || error,
      })
    }
  }




  /**
 * @swagger
 * /api/date-of-visits/days:
 *   get:
 *     summary: Отримати дні відвідування поточного місяця
 *     description: Повертає всі дні (числа), коли поточний авторизований користувач відвідував систему протягом поточного місяця.
 *     tags:
 *       - DateOfVisits
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішно отримано дні відвідування
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Days of visits for the current month
 *                 data:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 3, 10, 12, 20]
 *       401:
 *         description: Неавторизований доступ. Користувач не аутентифікований
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       500:
 *         description: Помилка на сервері при отриманні днів відвідування
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching visit days
 */

  public async getCurrentMonthVisitDays({ auth, response }: HttpContextContract) {
    try {
      // Отримання аутентифікованого користувача
      const user = await auth.authenticate()

      // Діапазон дат для поточного місяця
      const startOfMonth = DateTime.local().startOf('month')
      const endOfMonth = DateTime.local().endOf('month')

      // Отримання днів відвідування для поточного місяця
      const visits = await DateOfVisit.query()
        .where('userId', user.userId)
        .whereBetween('date', [startOfMonth.toSQLDate(), endOfMonth.toSQLDate()])

      // Форматування результату - лише дні
      const visitDays = [...new Set(visits.map((visit) => visit.date.day))]


      return response.status(200).json({
        message: 'Days of visits for the current month',
        data: visitDays,
      })
    } catch (error) {
      console.error('Error fetching visit days:', error)
      return response.status(500).json({ message: 'Error fetching visit days' })
    }
  }
}
