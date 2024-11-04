// app/Controllers/Http/FriendController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import People from 'App/Models/People'
import User from 'App/Models/User'



export default class PeopleController {
  /**
   * @swagger
   * /friends:
   *   post:
   *     summary: Add a friend
   *     tags: [Friends]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               friendUserId:
   *                 type: integer
   *                 example: 2
   *     responses:
   *       201:
   *         description: Friend request sent
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
   *                     userId:
   *                       type: integer
   *                     friendUserId:
   *                       type: integer
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Friend not found
   */
  // Додавання друга
  public async addFriend({ auth, request, response }: HttpContextContract) {
    // Отримання ID поточного авторизованого користувача
    const userId = auth.user?.userId;
  
    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' });
    }
  
    const { friendUserId } = request.only(['friendUserId']);
  
    // Перевірка на існування друга
    const friendUser = await User.find(friendUserId);
    if (!friendUser) {
      return response.status(404).json({ message: 'Friend not found' });
    }
  
    const friendship = await People.create({
      userId,
      friendUserId,
    });
  
    return response.status(201).json({ message: 'Friend request sent', data: friendship });
  }
  

  /**
   * @swagger
   * /friends/added-ids:
   *   get:
   *     summary: Get added user IDs
   *     tags: [Friends]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of added user IDs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 addedUserIds:
   *                   type: array
   *                   items:
   *                     type: integer
   *       401:
   *         description: Unauthorized
   */
  public async getAddedUserIds({ auth, response }: HttpContextContract) {
    const userId = auth.user?.userId

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    // Отримання ID всіх користувачів, яких додав поточний користувач
    const friends = await People.query()
      .where('userId', userId)
      .select('friendUserId')

    // Створення масиву тільки з значень friendUserId
    const addedUserIds = friends.map(friend => friend.friendUserId)

    return response.status(200).json({ addedUserIds })
  }


  /**
   * @swagger
   * /friends/mutual:
   *   get:
   *     summary: Get mutual friends
   *     tags: [Friends]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of mutual friends IDs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mutualFriendsIds:
   *                   type: array
   *                   items:
   *                     type: integer
   *       401:
   *         description: Unauthorized
   */
  public async getFriends({ auth, response }: HttpContextContract) {
    const userId = auth.user?.userId

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    // Запит для отримання лише взаємних друзів
    const mutualFriends = await People.query()
      .where('userId', userId)
      .whereIn('friendUserId', (subquery) => {
        subquery
          .from('people')
          .where('friendUserId', userId)
          .select('userId')
      })
      .select('friendUserId')

    // Масив ID взаємних друзів
    const mutualFriendsIds = mutualFriends.map((friend) => friend.friendUserId)

    return response.status(200).json({ mutualFriendsIds })
  }



  /**
   * @swagger
   * /friends/subscribers:
   *   get:
   *     summary: Get subscribers
   *     tags: [Friends]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of subscriber IDs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 subscriberIds:
   *                   type: array
   *                   items:
   *                     type: integer
   *       401:
   *         description: Unauthorized
   */
  public async getSubscribers({ auth, response }: HttpContextContract) {
    const userId = auth.user?.userId
  
    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  
    // Отримання ID всіх користувачів, які додали поточного користувача у підписки
    const subscribers = await People.query()
      .where('friendUserId', userId)
      .select('userId')
  
    // Створення масиву тільки з значень userId
    const subscriberIds = subscribers.map(subscriber => subscriber.userId)
  
    return response.status(200).json({ subscriberIds })
  }




/**
   * @swagger
   * /friends/{id}:
   *   delete:
   *     summary: Remove a friend subscription
   *     tags: [Friends]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the friend user to remove
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Subscription removed successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Subscription not found
   */
  // Видалення підписки на конкретного користувача
  public async deleteFriend({ auth, params, response }: HttpContextContract) {
    const userId = auth.user?.userId
  
    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  
    // Отримуємо ID користувача, на якого підписаний поточний користувач, з параметрів запиту
    const friendUserId = params.id; // зміна з friendUserId на id
  
    // Знаходимо запис про підписку
    const subscription = await People.query()
      .where('userId', userId)
      .where('friendUserId', friendUserId)
      .first()
  
    // Якщо запис про підписку не знайдено
    if (!subscription) {
      return response.status(404).json({ message: 'Subscription not found' })
    }
  
    // Видалення підписки
    await subscription.delete()
  
    return response.status(200).json({ message: 'Subscription removed successfully' })
  }
  

}
