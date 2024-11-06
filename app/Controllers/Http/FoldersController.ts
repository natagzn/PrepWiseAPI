// app/Controllers/Http/FoldersController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Folder from 'App/Models/Folder'
import { DateTime } from 'luxon'
import SetInFolder from 'App/Models/SetInFolder'
import Favourite from 'App/Models/Favorite'


export default class FoldersController {
  /**
   * @swagger
   * /api/folders:
   *   post:
   *     summary: Create a new folder
   *     tags: [Folders]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "My New Folder"
   *     responses:
   *       201:
   *         description: Folder created successfully
   *       500:
   *         description: Failed to create folder
   */
  // Створення нової папки
  public async create({ auth, request, response }: HttpContextContract) {
    try {
        const user = await auth.authenticate();
        const data = request.only(['name']);
        
        // Отримуємо масив ID сетів з запиту
        const sets = request.input('sets', []);

        // Створюємо папку
        const folder = await Folder.create({
            ...data,
            userId: user.userId,
            date: DateTime.local() // Встановлення поточної дати
        });

        // Додаємо сети до папки, якщо вони передані
        for (const setId of sets) {
            await SetInFolder.create({
                setId,
                folderId: folder.folderId,
            });
        }

        return response.status(201).json({ message: 'Folder created successfully', folder });
    } catch (error) {
        return response.status(500).json({ message: 'Failed to create folder', error });
    }
}



  /**
   * @swagger
   * /api/folders/{id}/sets:
   *   post:
   *     summary: Add a set to a folder
   *     tags: [Folders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the folder
   *         schema:
   *           type: integer
   *       - in: query
   *         name: setId
   *         required: true
   *         description: The ID of the set to add
   *         schema:
   *           type: integer
   *     responses:
   *       201:
   *         description: Set added to folder successfully
   *       500:
   *         description: Failed to add set to folder
   */
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
  



  /**
   * @swagger
   * /api/folders:
   *   get:
   *     summary: Get all folders of the authenticated user
   *     tags: [Folders]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User folders with sets and questions
   *       401:
   *         description: User not authenticated
   *       500:
   *         description: Failed to fetch folders
   */
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




/**
 * @swagger
 * /api/folders/{id}:
 *   get:
 *     summary: Get Folder by id
 *     tags: [Folders]
 *     description: Повертає деталі папки за заданим ID, включаючи назву, кількість сетів та інформацію про вподобання користувача.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID папки, яку потрібно отримати.
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Успішно повернуто інформацію про папку.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Унікальний ідентифікатор папки.
 *                 name:
 *                   type: string
 *                   description: Назва папки.
 *                 sets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Унікальний ідентифікатор сета.
 *                       name:
 *                         type: string
 *                         description: Назва сета.
 *                 isFavourite:
 *                   type: boolean
 *                   description: true, якщо папка вподобана користувачем, інакше false.
 *       404:
 *         description: Папка не знайдена.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Folder not found'
 */

public async show({ params, auth, response }: HttpContextContract) {
  try {
      const user = await auth.authenticate(); // Аутентифікація користувача
      const folder = await Folder.findOrFail(params.id); // Знаходимо папку за ID

      // Отримуємо всі сети, які відносяться до вказаної папки
      const sets = await SetInFolder.query()
          .where('folderId', folder.folderId);

      // Перевірка, чи вподобана папка поточним користувачем
      const isFavourite = await Favourite.query()
          .where('folderId', folder.folderId)
          .andWhere('userId', user.userId)
          .first();

      return response.status(200).json({
          id: folder.folderId,
          name: folder.name,
          sets: sets, // Масив із сетами у папці та інформацією про них
          isFavourite: !!isFavourite, // true, якщо вподобана, інакше false
          date: folder.date
      });
  } catch (error) {
      return response.status(404).json({ message: 'Folder not found' });
  }
}





  /**
   * @swagger
   * /api/folders/{id}:
   *   put:
   *     summary: Update a folder by ID
   *     tags: [Folders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the folder to update
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Updated Folder Name"
   *     responses:
   *       200:
   *         description: Folder updated successfully
   *       500:
   *         description: Failed to update folder
   */
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


  /**
   * @swagger
   * /api/folders/{id}:
   *   delete:
   *     summary: Delete a folder by ID
   *     tags: [Folders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the folder to delete
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Folder deleted successfully
   *       500:
   *         description: Failed to delete folder
   */
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
