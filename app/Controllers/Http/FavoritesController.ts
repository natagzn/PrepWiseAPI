import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Favourite from 'App/Models/Favorite'
import Folder from 'App/Models/Folder'
import Set from 'App/Models/Set'
import Resource from 'App/Models/Resource'

export default class FavouritesController {
  /**
   * @swagger
   * /api/favorites/set:
   *   post:
   *     summary: Add a set to favourites
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
   *               questionListId:
   *                 type: integer
   *                 description: The ID of the set to add to favourites
   *     responses:
   *       201:
   *         description: Set added to favourites successfully
   *       500:
   *         description: Failed to add set to favourites
   */
  
  public async addSetToFavourites({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const { questionListId } = request.only(['questionListId'])

      const favourite = await Favourite.create({
        userId: user.userId,
        questionListId
      })

      return response.status(201).json({ message: 'Set added to favourites successfully', favourite })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to add set to favourites', error })
    }
  }

  /**
   * @swagger
   * /api/favorites/set:
   *   delete:
   *     summary: Remove a set from favourites
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
   *               questionListId:
   *                 type: integer
   *                 description: The ID of the set to remove from favourites
   *     responses:
   *       200:
   *         description: Set removed from favourites successfully
   *       404:
   *         description: Favourite set not found
   *       500:
   *         description: Failed to remove set from favourites
   */
  public async removeSetFromFavourites({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const { questionListId } = request.only(['questionListId'])

      const favourite = await Favourite.query()
        .where('userId', user.userId)
        .andWhere('questionListId', questionListId)
        .first()

      if (!favourite) {
        return response.status(404).json({ message: 'Favourite set not found' })
      }

      await favourite.delete()
      return response.status(200).json({ message: 'Set removed from favourites successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to remove set from favourites', error })
    }
  }



  /**
   * @swagger
   * /api/favorites/folder:
   *   post:
   *     summary: Add a folder to favourites
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
   *               folderId:
   *                 type: integer
   *                 description: The ID of the folder to add to favourites
   *     responses:
   *       201:
   *         description: Folder added to favourites successfully
   *       500:
   *         description: Failed to add folder to favourites
   */
  public async addFolderToFavourites({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const { folderId } = request.only(['folderId'])

      const favourite = await Favourite.create({
        userId: user.userId,
        folderId
      })

      return response.status(201).json({ message: 'Folder added to favourites successfully', favourite })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to add folder to favourites', error })
    }
  }


  /**
   * @swagger
   * /api/favorites/folder:
   *   delete:
   *     summary: Remove a folder from favourites
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
   *               folderId:
   *                 type: integer
   *                 description: The ID of the folder to remove from favourites
   *     responses:
   *       200:
   *         description: Folder removed from favourites successfully
   *       404:
   *         description: Favourite folder not found
   *       500:
   *         description: Failed to remove folder from favourites
   */
  public async removeFolderFromFavourites({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const { folderId } = request.only(['folderId'])

      const favourite = await Favourite.query()
        .where('userId', user.userId)
        .andWhere('folderId', folderId)
        .first()

      if (!favourite) {
        return response.status(404).json({ message: 'Favourite folder not found' })
      }

      await favourite.delete()
      return response.status(200).json({ message: 'Folder removed from favourites successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to remove folder from favourites', error })
    }
  }





  
  /*public async addResourceToFavourites({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const { resourceId } = request.only(['resourceId'])

      const favourite = await Favourite.create({
        userId: user.userId,
        resourceId
      })

      return response.status(201).json({ message: 'Resource added to favourites successfully', favourite })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to add resource to favourites', error })
    }
  }*/


  /**
   * @swagger
   * /api/favorites/resource:
   *   delete:
   *     summary: Remove a resource from favourites
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
   *                 description: The ID of the resource to remove from favourites
   *     responses:
   *       200:
   *         description: Resource removed from favourites successfully
   *       404:
   *         description: Favourite resource not found
   *       500:
   *         description: Failed to remove resource from favourites
   */
  /*public async removeResourceFromFavourites({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const { resourceId } = request.only(['resourceId'])

      const favourite = await Favourite.query()
        .where('userId', user.userId)
        .andWhere('resourceId', resourceId)
        .first()

      if (!favourite) {
        return response.status(404).json({ message: 'Favourite resource not found' })
      }

      await favourite.delete()
      return response.status(200).json({ message: 'Resource removed from favourites successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to remove resource from favourites', error })
    }
  }*/






  /**
   * @swagger
   * /api/favorites:
   *   get:
   *     summary: Get user favourites
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User favourites retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 favourites:
   *                   type: object
   *                   properties:
   *                     folders:
   *                       type: array
   *                       items:
   *                         type: object
   *                     sets:
   *                       type: array
   *                       items:
   *                         type: object
   *                     resources:
   *                       type: array
   *                       items:
   *                         type: object
   *       500:
   *         description: Failed to retrieve user favourites
   */
  public async getFavourites({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()

      // Отримання обраних папок
      const folders = await Folder.query()
        .whereIn('folderId', (query) =>
          query.from('favourites').select('folder_id').where('user_id', user.userId)
        )

      // Отримання обраних сетів
      const sets = await Set.query()
        .whereIn('QuestionSet_id', (query) =>
          query.from('favourites').select('question_list_id').where('user_id', user.userId)
        )

      // Отримання обраних ресурсів
      const resources = await Resource.query()
        .whereIn('resourceId', (query) =>
          query.from('favourites').select('resource_id').where('user_id', user.userId)
        )

      return response.status(200).json({
        message: 'User favourites retrieved successfully',
        favourites: {
          folders,
          sets,
          resources
        }
      })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve user favourites', error })
    }
  }
}
