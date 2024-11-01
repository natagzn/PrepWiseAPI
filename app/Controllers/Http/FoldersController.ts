// app/Controllers/Http/FoldersController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Folder from 'App/Models/Folder'
import { DateTime } from 'luxon'
import SetInFolder from 'App/Models/SetInFolder'


export default class FoldersController {
  // Створення нової папки
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const data = request.only(['name'])

      const folder = await Folder.create({
        ...data,
        userId: user.userId,
        date: DateTime.local() // Встановлення поточної дати
      })

      return response.status(201).json({ message: 'Folder created successfully', folder })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create folder', error })
    }
  }


  public async addSetToFolder({ params, request, response }: HttpContextContract) {
    try {
      const { setId } = request.only(['setId']) // Отримуємо ID набору з запиту

      const folder = await Folder.findOrFail(params.id) // Знаходимо папку за ID

      // Створюємо запис у таблиці SetInFolder
      const setInFolder = await SetInFolder.create({
        setId,
        folderId: folder.folderId,
      })

      return response.status(201).json({
        message: 'Set added to folder successfully',
        setInFolder,
      })
    } catch (error) {
      console.error('Error adding set to folder:', error) // Виводимо деталі помилки в консоль
      return response.status(500).json({ 
        message: 'Failed to add set to folder', 
        error: error.message || 'Unknown error'  // Додаємо повідомлення помилки у відповідь
      })
    }
  }
  



  public async getUserFoldersWithSetsAndQuestions({ auth, response }: HttpContextContract) {
    try {
      // Отримання ID поточного користувача
      const userId = auth.user?.userId
      if (!userId) {
        return response.status(401).json({ message: 'User not authenticated' })
      }

      // Завантаження папок користувача з вкладеними сетами та питаннями
      const folders = await Folder
        .query()
        .where('userId', userId)
        .preload('setsInFolder', (setInFolderQuery) => {
          setInFolderQuery.preload('set', (setQuery) => {
            setQuery.preload('questions')
          })
        })

      return response.status(200).json({
        message: 'User folders with sets and questions',
        data: folders,
      })
    } catch (error) {
      console.error('Error fetching folders:', error)
      return response.status(500).json({
        message: 'Failed to fetch folders',
        error: error.message || 'Unknown error'
      })
    }
  }









  // Отримання всіх папок
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const folders = await Folder.query().where('userId', user.userId)

      return response.status(200).json(folders)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve folders', error })
    }
  }

  // Отримання папки за ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const folder = await Folder.findOrFail(params.id)
      return response.status(200).json(folder)
    } catch (error) {
      return response.status(404).json({ message: 'Folder not found' })
    }
  }

  // Оновлення папки за ID
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const folder = await Folder.findOrFail(params.id)
      const data = request.only(['name'])

      folder.merge(data)
      await folder.save()

      return response.status(200).json({ message: 'Folder updated successfully', folder })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update folder', error })
    }
  }

  // Видалення папки за ID
  public async delete({ params, response }: HttpContextContract) {
    try {
      const folder = await Folder.findOrFail(params.id)
      await folder.delete()

      return response.status(200).json({ message: 'Folder deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete folder', error })
    }
  }
}
