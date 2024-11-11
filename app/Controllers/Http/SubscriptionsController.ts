import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Subscription from 'App/Models/Subscription'


export default class SubscriptionsController {


/**
 * @swagger
 * /api/subscription:
 *   post:
 *     summary: Створення або продовження підписки користувача
 *     description: Створює нову підписку на місяць для користувача, якщо жодна активна підписка не існує. Якщо є активна підписка, подовжує її на місяць.
 *     tags:
 *       - Subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeId:
 *                 type: integer
 *                 description: ID типу підписки
 *                 example: 1
 *     responses:
 *       201:
 *         description: Підписка успішно створена або подовжена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription processed successfully"
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Унікальний ID підписки
 *                     typeId:
 *                       type: integer
 *                       description: ID типу підписки
 *                     userId:
 *                       type: integer
 *                       description: ID користувача
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: Дата закінчення підписки
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Дата створення підписки
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Дата останнього оновлення підписки
 *       500:
 *         description: Не вдалося обробити підписку
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to process subscription"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */

  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const userId = (await auth.authenticate()).userId
      const { typeId } = request.only(['typeId'])
  
      // Отримання існуючої активної підписки для користувача
      const existingSubscription = await Subscription.query()
        .where('userId', userId)
        .andWhere('date', '>', DateTime.local().toJSDate()) // Перевірка, чи діє підписка на даний момент
        .first()
  
      let subscription
  
      if (existingSubscription) {
        // Якщо є активна підписка, продовжуємо її ще на місяць
        const currentEndDate = DateTime.fromJSDate(existingSubscription.date.toJSDate())
        const newEndDate = currentEndDate.plus({ months: 1 })
  
        // Перевірка та зміна року, якщо нова дата переходить на наступний рік
        subscription = await existingSubscription.merge({ date: newEndDate }).save()
      } else {
        // Якщо активної підписки немає, створюємо нову з датою наступного місяця
        const nextMonthDate = DateTime.local().plus({ months: 1 })
        subscription = await Subscription.create({
          typeId,
          userId,
          date: nextMonthDate,
        })
      }
  
      return response.status(201).json({
        message: 'Subscription processed successfully',
        subscription,
      })
    } catch (error) {
      console.error('Error processing subscription:', error)
      return response.status(500).json({ message: 'Failed to process subscription', error: error.message })
    }
  }
}
