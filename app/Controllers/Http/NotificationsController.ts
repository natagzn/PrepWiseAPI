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
      const requestForHelp = await RequestForHelp.query()
        .preload('friend')
        .preload('question')
        .firstOrFail()

      return response.status(200).json({
        data: requestForHelp,
      })
    } catch (error) {
      console.error('Error fetching RequestForHelp:', error)
      return response.status(404).json({ message: 'RequestForHelp not found' })
    }
  }

  public async getHelpAnswers({ response }: HttpContextContract) {
    const helpAnswer = await HelpAnswer.query()
        .preload('friend')    // Підвантаження зв'язку з Friend
        .preload('question')  // Підвантаження зв'язку з Question
        .first()

      if (!helpAnswer) {
        return response.status(404).json({ message: 'HelpAnswer not found' })
      }

      return response.status(200).json({ data: helpAnswer })
    } catch (error) {
      console.error('Error fetching HelpAnswer:', error)
      //return response.status(500).json({ message: 'Failed to fetch HelpAnswer', error: error.message })
    
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

  /*public async getUserNotifications({ auth, response }: HttpContextContract) {
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
                .orderBy('created_at', 'desc')
            )
            .orWhereExists((subquery) =>
              subquery
                .from('request_for_helps')
                .whereRaw('request_for_helps.id = notifications.question_id')
                .where('request_for_helps.friend_id', userId)
                .orderBy('created_at', 'desc')
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
  }*/




    public async getUserNotifications({ auth, response }: HttpContextContract) {
      try {
        // Аутентифікація користувача
        const user = await auth.authenticate();
        const userId = user.userId;
  
        // Пошук відповідей на питання, які належать до сетів, створених поточним користувачем
const userAnswers = await HelpAnswer.query()
.whereExists((questionQuery) =>
  questionQuery
    .from('questions')
    .whereRaw('questions.question_id = help_answers.question_id') // Зв'язок з питанням
    .whereExists((setQuery) =>
      setQuery
        .from('sets')
        .whereRaw('sets.question_set_id = questions.list_id') // Зв'язок з сетом
        .where('sets.user_id', userId) // Перевіряємо, чи поточний користувач є автором сету
    )
)
.select('id'); // Отримуємо тільки ID відповіді

        
const notifications = await Notification.query()
  .preload('type') // Завантажуємо тип сповіщення
  .preload('answer') // Завантажуємо пов'язану відповідь
  .whereIn('answer_id', userAnswers.map(answer => answer.id)) // Фільтруємо сповіщення по знайденим ID відповідей
  .orderBy('created_at', 'desc'); // Сортуємо за датою створення



  const userRequestIds = await RequestForHelp.query()
  .where('friend_id', userId) // Перевіряємо, чи поточний користувач є другом
  .select('id'); // Отримуємо тільки ID запитів про допомогу

  const notifications1 = await Notification.query()
  .preload('type') // Завантажуємо тип сповіщення
  .preload('question') // Завантажуємо пов'язаний запит про допомогу
  .whereIn('question_id', userRequestIds.map(request => request.id)) // Фільтруємо сповіщення по знайденим ID запитів
  .orderBy('created_at', 'desc'); // Сортуємо за датою створення



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

  const formattedNotifications1 = await Promise.all(
    notifications1.map(async (notification) => {
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
  const combinedNotifications = [...formattedNotifications, ...formattedNotifications1];

  return response.status(200).json(combinedNotifications);

      } catch (error) {
        console.error('Error fetching notifications:', error);
        return response.status(500).json({ message: 'Помилка при отриманні сповіщень', error });
      }
    }
}
