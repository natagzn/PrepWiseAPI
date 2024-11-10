import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RequestForHelp from 'App/Models/RequestForHelp'
import HelpAnswer from 'App/Models/HelpAnswer'
import Notification from 'App/Models/Notification'

import { DateTime } from 'luxon'

import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class NotificationsController {

  
  public async create({ request, response }: HttpContextContract) {
    // Валідація вхідних даних
    const notificationSchema = schema.create({
      type_id: schema.number([rules.exists({ table: 'types_notifications', column: 'id' })]),
      answer_id: schema.number.optional([rules.exists({ table: 'help_answers', column: 'id' })]),
      question_id: schema.number.optional([rules.exists({ table: 'request_for_helps', column: 'id' })]),
      date: schema.date(),
    })

    const payload = await request.validate({ schema: notificationSchema })

    // Створення нового запису в таблиці Notifications
    const notification = await Notification.create({
      typeId: payload.type_id,
      answerId: payload.answer_id,
      questionId: payload.question_id,
      date: DateTime.local(),
    })

    return response.status(201).json({
      message: 'Notification created successfully',
      data: notification,
    })
  }

  public async getHelpRequests({ response }: HttpContextContract) {
    try {
      const requests = await RequestForHelp.query()
        .preload('friend', (friendQuery) => {
          friendQuery.preload('user')
          friendQuery.preload('friendUser')
        })
        .preload('question')

      const formattedRequests = requests.map((request) => ({
        id: request.id,
        from: request.friend.user, // Користувач, який відправив запит
        to: request.friend.friendUser, // Користувач, якому направлений запит
        question: request.question,
        date: request.date,
      }))

      return response.status(200).json(formattedRequests)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Помилка при отриманні запитів на допомогу', error})
    }
  }

  public async getHelpAnswers({ response }: HttpContextContract) {
    try {
      const answers = await HelpAnswer.query()
        .preload('friend', (friendQuery) => {
          friendQuery.preload('user')
          friendQuery.preload('friendUser')
        })
        .preload('question')

      const formattedAnswers = answers.map((answer) => ({
        id: answer.id,
        from: answer.friend.user, // Користувач, який відповів
        to: answer.friend.friendUser, // Користувач, який отримав відповідь
        question: answer.question,
        content: answer.content,
        date: answer.date,
      }))

      return response.status(200).json(formattedAnswers)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Помилка при отриманні відповідей на запити' })
    }
  }






  /**
   * @swagger
   * /api/notifications-user:
   *   get:
   *     summary: Отримання сповіщень користувача
   *     tags:
   *       - Notifications
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список сповіщень користувача
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   typeId:
   *                     type: integer
   *                     description: ID типу сповіщення
   *                   date:
   *                     type: string
   *                     format: date
   *                     description: Дата сповіщення
   *                   questionId:
   *                     type: integer
   *                     description: ID запиту на допомогу
   *                   answerId:
   *                     type: integer
   *                     description: ID відповіді
   *       401:
   *         description: Аутентифікація не вдалася
   */

  public async getUserNotifications({ auth, response }: HttpContextContract) {
    try {
      // Аутентифікація користувача
      const user = await auth.authenticate();
      const userId = user.userId;

      // Отримуємо всі сповіщення, пов'язані з користувачем, які є в RequestForHelp або HelpAnswer
      const notifications = await Notification.query()
        .preload('type') // Завантажуємо інформацію про тип сповіщення
        .preload('answer', (query) => {
          query.where('friend_id', userId); // Відповіді на допомогу, надіслані користувачу
        })
        .preload('question', (query) => {
          query.where('friend_id', userId); // Запити на допомогу, надіслані користувачу
        })
        .where((query) => {
          // Відфільтровуємо тільки ті сповіщення, де є відповіді або запити для поточного користувача
          query
            .whereExists((subquery) =>
              subquery
                .from('help_answers')
                .whereRaw('help_answers.id = notifications.answer_id')
                .where('help_answers.friend_id', userId)
            )
            .orWhereExists((subquery) =>
              subquery
                .from('request_for_helps')
                .whereRaw('request_for_helps.id = notifications.question_id')
                .where('request_for_helps.friend_id', userId)
            );
        });

      // Форматуємо результат
      const formattedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          await notification.load('type');
      
          const typeId = notification.typeId;
          const typeName = notification.type?.name; 
          const date = notification.createdAt;
          const requestId = notification.questionId;
          const answerId = notification.answerId;
      
          return {
            typeId,
            typeName, 
            date,
            requestId,
            answerId,
          };
        })
      );

      return response.status(200).json(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return response.status(500).json({ message: 'Помилка при отриманні сповіщень' });
    }
  }
}
