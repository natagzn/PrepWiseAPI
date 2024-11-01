import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Favourite from 'App/Models/Favourite'

export default class FavouritesController {
  
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






  public async addResourceToFavourites({ auth, request, response }: HttpContextContract) {
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
  }

  public async removeResourceFromFavourites({ auth, request, response }: HttpContextContract) {
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
  }

}
