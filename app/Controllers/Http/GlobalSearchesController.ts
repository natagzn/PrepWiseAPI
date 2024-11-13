import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Set from 'App/Models/Set'
import Resource from 'App/Models/Resource'
import User from 'App/Models/User'

export default class GlobalSearchesController {
  /**
   * @swagger
   * /api/global-search:
   *   get:
   *     summary: Пошук по публічних сетах, ресурсах та користувачах
   *     tags:
   *       - GlobalSearch
   *     parameters:
   *       - name: query
   *         in: query
   *         required: true
   *         description: Текст для пошуку
   *         schema:
   *           type: string
   *           example: "математика"
   *     responses:
   *       200:
   *         description: Результати пошуку
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 sets:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       QuestionSet_id:
   *                         type: integer
   *                         example: 1
   *                       name:
   *                         type: string
   *                         example: "Математика 101"
   *                 resources:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       resourceId:
   *                         type: integer
   *                         example: 1
   *                       title:
   *                         type: string
   *                         example: "Основи математики"
   *                       description:
   *                         type: string
   *                         example: "Вступ до основних понять"
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       userId:
   *                         type: integer
   *                         example: 1
   *                       name:
   *                         type: string
   *                         example: "Іван"
   *                       surname:
   *                         type: string
   *                         example: "Петренко"
   *                       username:
   *                         type: string
   *                         example: "ivanpetrenko"
   */
  public async globalSearch({auth, request, response }: HttpContextContract) {
    const userId = (await auth.authenticate()).userId
    const query = request.input('query')

    // Пошук по сетах
    const sets = await Set.query()
      .where('access', true)
      .andWhere('name', 'LIKE', `%${query}%`)
      .select('question_set_id', 'name')
      .orderBy('created_at', 'desc')

    // Пошук по ресурсах
    const resources = await Resource.query()
      .where((builder) => {
        builder
          .where('title', 'LIKE', `%${query}%`)
          .orWhere('description', 'ILIKE', `%${query}%`)
      })
      .select('resource_id', 'title', 'description')
      .orderBy('created_at', 'desc')

    // Пошук по користувачах
    const users = await User.query()
      .where((builder) => {
        builder
          .orWhere('username', 'LIKE', `%${query}%`)
      })
      .andWhereNot('userId', userId) 
      .select('userId', 'username')

    // Повертаємо результати
    return response.status(200).json({
      sets,
      resources,
      users,
    })
  }
}
