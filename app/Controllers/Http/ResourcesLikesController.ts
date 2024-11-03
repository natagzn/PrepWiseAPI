import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ResourceLike from 'App/Models/ResourceLike';

export default class ResourcesLikesController {
  // Додати лайк
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      const { resourceId, like } = request.only(['resourceId', 'like']);
    
      // Перетворюємо значення `like` на булевий тип
      const isLiked = like === 'true' || like === true;

      const resourceLike = await ResourceLike.updateOrCreate(
        {
          userId: user.userId,
          resourceId,
        },
        {
          like: isLiked,
        }
      );
    
      return response.status(201).json({ message: 'Like added successfully', resourceLike });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to add like', error });
    }    
  }

  // Отримати лайки для ресурсу
  public async index({ params, response }: HttpContextContract) {
    try {
      const resourceId = params.resourceId;
      const likes = await ResourceLike.query().where('resourceId', resourceId);
      return response.status(200).json(likes);
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve likes', error });
    }
  }

  // Оновити лайк (дизлайк)
  public async update({ auth, request, params, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      const { like } = request.only(['like']);
      const isLiked = like === 'true' || like === true;

      const resourceLike = await ResourceLike.query()
        .where('userId', user.userId)
        .where('resourceId', params.resourceId)
        .firstOrFail();

      resourceLike.like = isLiked;
      await resourceLike.save();

      return response.status(200).json({ message: 'Like updated successfully', resourceLike });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update like', error });
    }
  }

  // Видалити лайк
  public async destroy({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      const resourceLike = await ResourceLike.query()
        .where('userId', user.userId)
        .where('resourceId', params.resourceId)
        .firstOrFail();

      await resourceLike.delete();

      return response.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to remove like', error });
    }
  }
}
