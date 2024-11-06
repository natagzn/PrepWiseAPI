import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

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
   * /api/profile:
   *   put:
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
   *               name:
   *                 type: string
   *                 description: User's name
   *               surname:
   *                 type: string
   *                 description: User's surname
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

}
