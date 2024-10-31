import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Feedback from 'App/Models/Feedback'

export default class FeedbacksController {
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
}
