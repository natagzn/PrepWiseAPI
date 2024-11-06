import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DateOfVisit from 'App/Models/DateOfVisit'

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
}
