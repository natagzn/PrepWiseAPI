// app/Controllers/Http/FriendController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import People from 'App/Models/People'
import User from 'App/Models/User'



export default class PeoplesController {
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




  // Видалити друга
  public async deleteFriend({ params, response }: HttpContextContract) {
    const friendId = params.id

    const friendship = await People.find(friendId)

    if (!friendship) {
      return response.status(404).json({ message: 'Friendship not found' })
    }

    await friendship.delete()
    return response.status(200).json({ message: 'Friend removed successfully' })
  }
}
