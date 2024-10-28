import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Feedback from 'App/Models/Feedback'

export default class FeedbacksController {
  public async store({ request, response }: HttpContextContract) {
    const { userId, content, imageUrl } = request.all()

    const feedback = await Feedback.create({
      userId,
      content,
      imageUrl,
    })

    return response.status(201).json(feedback)
  }
}
