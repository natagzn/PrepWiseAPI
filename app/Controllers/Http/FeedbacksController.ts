import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Feedback from 'App/Models/Feedback'


/**
 * @swagger
 * tags:
 *   name: Feedbacks
 *   description: API для роботи зі зворотним зв'язком
 */
export default class FeedbacksController {
    /**
   * @swagger
   * /api/feedbacks:
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
}
