import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ResourceLike from 'App/Models/ResourceLike';
import Favorite from 'App/Models/Favorite';


export default class ResourcesLikesController {
  /**
   * @swagger
   * /api/resources-likes:
   *   post:
   *     summary: Add a like to a resource
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               resourceId:
   *                 type: integer
   *                 description: The ID of the resource to like.
   *               like:
   *                 type: boolean
   *                 description: Indicates whether the resource is liked or not.
   *     responses:
   *       201:
   *         description: Like added successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 resourceLike:
   *                   type: object
   *                   properties:
   *                     userId:
   *                       type: integer
   *                     resourceId:
   *                       type: integer
   *                     like:
   *                       type: boolean
   *       500:
   *         description: Failed to add like
   */
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

      if(isLiked){
        const favourite = await Favorite.create({
          userId: user.userId,
          resourceId
        })
      
        return response.status(201).json({ message: 'Like added successfully', resourceLike, favourite });
      }
      return response.status(201).json({ message: 'DisLike added successfully', resourceLike });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to add like', error });
    }    
  }

  /**
   * @swagger
   * /api/resources/{resourceId}/likes:
   *   get:
   *     summary: Get likes for a resource
   *     tags: [Resources]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: resourceId
   *         required: true
   *         description: The ID of the resource to retrieve likes for.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Likes retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   userId:
   *                     type: integer
   *                   resourceId:
   *                     type: integer
   *                   like:
   *                     type: boolean
   *       500:
   *         description: Failed to retrieve likes
   */
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



  /**
   * @swagger
   * /api/resources/{resourceId}/likes:
   *   put:
   *     summary: Update a like (dislike) for a resource
   *     tags: [Resources]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: resourceId
   *         required: true
   *         description: The ID of the resource to update the like for.
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               like:
   *                 type: boolean
   *                 description: Indicates whether the resource is liked or not.
   *     responses:
   *       200:
   *         description: Like updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 resourceLike:
   *                   type: object
   *                   properties:
   *                     userId:
   *                       type: integer
   *                     resourceId:
   *                       type: integer
   *                     like:
   *                       type: boolean
   *       500:
   *         description: Failed to update like
   */
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


      if(!isLiked){
        const favourite = await Favorite.query()
        .where('userId', user.userId)
        .andWhere('resourceId', params.resourceId)
        .first()

      if (!favourite) {
        return response.status(404).json({ message: 'Favourite resource not found' })
      }
      await favourite.delete()
      }else{
        const favourite = await Favorite.create({
          userId: user.userId,
          resourceId: params.resourceId
        })
      
        return response.status(201).json({ message: 'Like added successfully', resourceLike, favourite });
      }
      
      return response.status(200).json({ message: 'Like updated successfully', resourceLike });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update like', error });
    }
  }


  /**
   * @swagger
   * /api/resources/{resourceId}/likes:
   *   delete:
   *     summary: Remove a like from a resource
   *     tags: [Resources]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: resourceId
   *         required: true
   *         description: The ID of the resource to remove the like from.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Like removed successfully
   *       500:
   *         description: Failed to remove like
   */
  // Видалити лайк
  public async destroy({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      const resourceLike = await ResourceLike.query()
        .where('userId', user.userId)
        .where('resourceId', params.resourceId)
        .firstOrFail();

      await resourceLike.delete();



      const favourite = await Favorite.query()
        .where('userId', user.userId)
        .andWhere('resourceId', params.resourceId)
        .first()

      if (!favourite) {
        return response.status(404).json({ message: 'Favourite resource not found' })
      }

      await favourite.delete()

      return response.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to remove like', error });
    }
  }
}
