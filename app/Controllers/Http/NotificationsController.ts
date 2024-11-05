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
      return response.status(500).json({ message: 'Помилка при отриманні запитів на допомогу' })
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
}
