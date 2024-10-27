import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
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
}
