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

    // Отримання останньої активної підписки для користувача
    const latestSubscription = await Subscription.query()
      .where('userId', userId)
      .andWhere('date', '>', DateTime.local().toJSDate()) // Перевірка, чи є активні підписки
      .orderBy('date', 'desc') // Сортуємо за датою, щоб отримати останній запис
      .first()

    let subscription

    if (latestSubscription) {
      // Якщо є активна підписка, створюємо нову з датою наступного місяця після завершення поточної
      const currentEndDate = DateTime.fromJSDate(latestSubscription.date.toJSDate())
      const newEndDate = currentEndDate.plus({ months: 1 })

      subscription = await Subscription.create({
        typeId,
        userId,
        date: newEndDate,
      })
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





/**
 * @swagger
 * /api/subscription:
 *   get:
 *     summary: Отримує список підписок користувача
 *     description: Повертає інформацію про всі активні підписки користувача, включаючи тип підписки та дати початку і закінчення.
 *     tags:
 *       - Subscriptions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Успішне отримання інформації про підписки.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription processed successfully
 *                 subscriptionDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subscriptionId:
 *                         type: integer
 *                         example: 1
 *                         description: Унікальний ідентифікатор підписки
 *                       typeId:
 *                         type: integer
 *                         example: 2
 *                         description: Ідентифікатор типу підписки
 *                       typeName:
 *                         type: string
 *                         example: Premium
 *                         description: Назва типу підписки
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         example: 2024-01-01
 *                         description: Дата початку підписки
 *                       endDate:
 *                         type: string
 *                         format: date
 *                         example: 2024-02-01
 *                         description: Дата закінчення підписки
 *       500:
 *         description: Помилка при обробці підписок
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to process subscription
 *                 error:
 *                   type: string
 *                   example: Error details
 */

public async getUserSubscriptions({ auth, response }: HttpContextContract) {
try{
  const userId = (await auth.authenticate()).userId
  const subscriptions = await Subscription.query()
    .where('userId', userId)
    .preload('type') 

  const subscriptionDetails = subscriptions.map((subscription) => {
  const startDate = DateTime.fromJSDate(subscription.date.toJSDate()).minus({ months: 1 })

    return {
      subscriptionId: subscription.subscriptionId,
      typeId: subscription.typeId,
      typeName: subscription.type?.name, 
      startDate: startDate.toISODate(),
      endDate: subscription.date.toISODate(), 
    }
  })

  return response.status(201).json({
    message: 'Subscription processed successfully',
    subscriptionDetails,
  })
}catch (error) {
  return response.status(500).json({ message: 'Failed to process subscription', error: error.message })
}
}

}
