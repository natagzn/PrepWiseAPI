import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Set from 'App/Models/Set'
import Resource from 'App/Models/Resource'
import People from 'App/Models/People'

export default class UsersController {

  /**
   * @swagger
   * /api/profile:
   *   get:
   *     summary: Get user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user_id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 surname:
   *                   type: string
   *                 username:
   *                   type: string
   *                 email:
   *                   type: string
   *                 avatar_url:
   *                   type: string
   *                 bio:
   *                   type: string
   *                 subscription_type:
   *                   type: string
   *                 location:
   *                   type: string
   *       401:
   *         description: User not authenticated
   */
  public async showProfile({ auth, response }: HttpContextContract) {
    try {
      // Отримуємо аутентифікованого користувача
      const user = await auth.authenticate()

      // Витягуємо дані профілю, окрім пароля
      const userProfile = await User.query()
        .select('user_id', 'name', 'surname', 'username', 'email', 'avatar_url', 'bio', 'subscription_type', 'location')
        .where('user_id', user.userId)
        .firstOrFail()

      return response.ok(userProfile)
    } catch (error) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
  }


  /**
   * @swagger
   * /api/profile/password:
   *   put:
   *     summary: Change user password
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               currentPassword:
   *                 type: string
   *                 description: Current password of the user
   *               newPassword:
   *                 type: string
   *                 description: New password of the user
   *     responses:
   *       200:
   *         description: Password changed successfully
   *       401:
   *         description: Incorrect current password
   */
  public async changePassword({ auth, request, response }: HttpContextContract) {
    // Валідація запиту
    const changePasswordSchema = schema.create({
      currentPassword: schema.string(),
      newPassword: schema.string({}, [
        rules.minLength(8),
        rules.confirmed(),
      ]),
    })

    const { currentPassword, newPassword } = await request.validate({
      schema: changePasswordSchema,
      messages: {
        'newPassword.minLength': 'Новий пароль повинен містити щонайменше 8 символів',
        'newPassword_confirmation.confirmed': 'Паролі не співпадають',
      }
    })

    // Отримати користувача
    const user = await User.findOrFail(auth.user!.userId)

    // Перевірити поточний пароль
    const isSame = await Hash.verify(user.password, currentPassword)
    if (!isSame) {
      return response.unauthorized({ message: 'Неправильний поточний пароль' })
    }

    // Оновити пароль
    user.password = await Hash.make(newPassword)
    await user.save()

    return response.ok({ message: 'Пароль успішно змінено' })
  }




  /**
   * @swagger
   * /api/update:
   *   post:
   *     summary: Update user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               avatarUrl:
   *                 type: string
   *                 format: uri
   *                 description: URL of the user's avatar
   *               bio:
   *                 type: string
   *                 description: User biography
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               location:
   *                 type: string
   *                 description: User's location
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     user_id:
   *                       type: integer
   *                     name:
   *                       type: string
   *                     surname:
   *                       type: string
   *                     username:
   *                       type: string
   *                     email:
   *                       type: string
   *                     avatar_url:
   *                       type: string
   *                     bio:
   *                       type: string
   *                     subscription_type:
   *                       type: string
   *                     location:
   *                       type: string
   *       400:
   *         description: Failed to update profile
   */
  public async updateProfile({ auth, request, response }: HttpContextContract) {
    try {
      // Отримати аутентифікованого користувача
      const user = await User.findOrFail(auth.user!.userId)

      // Створити схему валідації для необов'язкових полів
      const updateProfileSchema = schema.create({
        avatarUrl: schema.string.optional({}, [
          rules.url(),
        ]),
        bio: schema.string.optional({ trim: true }),
        email: schema.string.optional({}, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email', whereNot: { user_id: user.userId } }),
        ]),
        location: schema.string.optional({ trim: true }),
        username: schema.string.optional({}, [
          rules.unique({ table: 'users', column: 'username', whereNot: { user_id: user.userId } }),
        ])
      })

      // Валідація запиту
      const payload = await request.validate({
        schema: updateProfileSchema,
        messages: {
          'avatarUrl.url': 'Посилання на аватар має бути коректним URL',
          'email.email': 'Неправильний формат електронної пошти',
          'email.unique': 'Ця електронна пошта вже зайнята',
        },
      })

      // Оновити лише надані поля
      if (payload.avatarUrl) user.avatarUrl = payload.avatarUrl
      if (payload.bio) user.bio = payload.bio
      if (payload.email) user.email = payload.email
      if (payload.location) user.location = payload.location
      if (payload.username) user.username = payload.username



      // Зберегти зміни
      await user.save()

      return response.ok({ message: 'Профіль успішно оновлено', data: user })
    } catch (error) {
      return response.badRequest({ message: 'Не вдалося оновити профіль', error: error.message })
    }
  }






  /**
 * @swagger
 * /api/random:
 *   get:
 *     summary: Отримання випадкових публічних сетів і ресурсів від користувачів, на яких підписаний поточний користувач
 *     description: Повертає до 6 випадкових публічних сетів та 6 випадкових ресурсів, створених користувачами, на яких підписаний поточний користувач.
 *     tags:
 *       - Home
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішне отримання списку сетів і ресурсів
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
 *                         example: "Програмування"
 *                       userId:
 *                         type: integer
 *                         example: 5
 *                 resources:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       resourceId:
 *                         type: integer
 *                         example: 2
 *                       title:
 *                         type: string
 *                         example: "Основи JavaScript"
 *                       userId:
 *                         type: integer
 *                         example: 5
 *       401:
 *         description: Помилка автентифікації
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching random sets and resources"
 */

  public async getRandomSetsAndResources({ auth, response }: HttpContextContract) {
    const userId = auth.user?.userId

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    try {
      // Отримання ID всіх користувачів, яких додав поточний користувач
      const friends = await People.query()
        .where('userId', userId)
        .select('friendUserId')
      const addedUserIds = friends.map(friend => friend.friendUserId)

      if (addedUserIds.length === 0) {
        return response.status(200).json({ sets: [], resources: [] })
      }

      // Отримання випадкових публічних сетів від користувачів, на яких підписаний поточний користувач
      const sets = await Set.query()
        .whereIn('user_id', addedUserIds)
        .andWhere('access', true)
        .orderByRaw('RANDOM()')
        .limit(6)
        .select('question_set_id', 'name', 'user_id')

      // Отримання випадкових ресурсів від користувачів, на яких підписаний поточний користувач
      const resources = await Resource.query()
        .whereIn('user_id', addedUserIds)
        .orderByRaw('RANDOM()')
        .limit(6)
        .select('resource_id', 'title', 'user_id')

      return response.status(200).json({ sets, resources })
    } catch (error) {
      console.error('Error fetching random sets and resources:', error)
      return response.status(500).json({
        message: 'An error occurred while fetching random sets and resources',
      })
    }
  }
}
