// app/Controllers/Http/FoldersController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Folder from 'App/Models/Folder'
import { DateTime } from 'luxon'
import SetInFolder from 'App/Models/SetInFolder'
import Favourite from 'App/Models/Favorite'
import Database from '@ioc:Adonis/Lucid/Database';


export default class FoldersController {

/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: Створення нової папки
 *     description: Створює нову папку для поточного користувача з можливістю додавання в неї сетів.
 *     tags:
 *       - Folders
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
 *                 description: Назва нової папки.
 *                 example: "Моя нова папка"
 *               sets:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Масив ID сетів, які потрібно додати до папки.
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Папка успішно створена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Folder created successfully"
 *                 folder:
 *                   type: object
 *                   properties:
 *                     folderId:
 *                       type: integer
 *                       description: Унікальний ідентифікатор папки
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: Назва папки
 *                       example: "Моя нова папка"
 *                     userId:
 *                       type: integer
 *                       description: Ідентифікатор користувача, який створив папку
 *                       example: 5
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: Дата створення папки
 *                       example: "2024-11-05T12:34:56.000Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Дата та час створення папки в базі даних
 *                       example: "2024-11-05T12:34:56.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Дата та час останнього оновлення папки в базі даних
 *                       example: "2024-11-05T12:34:56.000Z"
 *       500:
 *         description: Помилка при створенні папки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create folder"
 *                 error:
 *                   type: object
 *                   description: Деталі помилки
 */

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
   * /api/folders/{id}/add-set:
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
  
      // Перевірка, чи вже є цей набір у папці
      const existingSetInFolder = await SetInFolder.query()
        .where('setId', setId)
        .andWhere('folderId', folder.folderId)
        .first()
  
      if (existingSetInFolder) {
        return response.status(400).json({
          message: 'Set already exists in the folder',
        })
      }
  
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
        error: error.message || 'Unknown error', // Додаємо повідомлення помилки у відповідь
      })
    }
  }
  
  



  /**
   * @swagger
   * /api/folders-with-all:
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
      const sets = (await Database
        .from('set_in_folders')
        .where('folder_id', folder.folderId)
        .select('set_id'))
        .map(row => row.set_id);

      // Перевірка, чи вподобана папка поточним користувачем
      const isFavourite = await Favourite.query()
          .where('folder_id', folder.folderId)
          .andWhere('user_id', user.userId)
          .first();

      return response.status(200).json({
          id: folder.folderId,
          name: folder.name,
          sets: sets , // Масив із сетами у папці та інформацією про них
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







/**
 * @swagger
 * /api/folders-set:
 *   delete:
 *     summary: Видалення сета з папки
 *     tags: [Folders]
 *     description: Даний метод дозволяє видалити заданий сет з вказаної папки за допомогою їх унікальних ідентифікаторів.
 *     parameters:
 *       - in: query
 *         name: folderId
 *         required: true
 *         description: Ідентифікатор папки, з якої потрібно видалити сет.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: setId
 *         required: true
 *         description: Ідентифікатор сета, який необхідно видалити з папки.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Сет успішно видалено з папки.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Set removed from folder successfully
 *       400:
 *         description: Відсутні необхідні параметри (folderId або setId).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Folder ID and Set ID are required
 *       404:
 *         description: Сет не знайдено в зазначеній папці.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Set not found in the specified folder
 *       500:
 *         description: Помилка при видаленні сета з папки.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error removing set from folder
 *                 error:
 *                   type: string
 *                   example: Internal server error details
 */

  public async removeSetFromFolder({ request, response }: HttpContextContract) {
    try {
      // Отримуємо `folder_id` та `set_id` з параметрів запиту
      const { folderId } = request.only(['folderId']) 
      const { setId } = request.only(['setId']) 


      console.log(`Received folderId: ${folderId}, questionSetId: ${setId}`);

      // Перевіряємо, чи отримали коректні значення
      if (!folderId || !setId) {
        return response.status(400).json({
          message: 'Folder ID and Set ID are required',
        });
      }

      // Знаходимо запис в таблиці SetInFolder
      const setInFolder = await SetInFolder.query()
        .where('folder_id', folderId)
        .andWhere('set_id', setId)
        .first();

      if (!setInFolder) {
        console.log('Set not found in the specified folder');
        return response.status(404).json({
          message: 'Set not found in the specified folder',
        });
      }

      // Видаляємо запис
      await setInFolder.delete();
      console.log('Set removed from folder successfully');

      return response.status(200).json({
        message: 'Set removed from folder successfully',
      });
    } catch (error) {
      console.error('Error details:', error); // Додатковий лог помилки
      return response.status(500).json({
        message: 'Error removing set from folder',
        error: error.message || error,
      });
    }
  }






/**
 * @swagger
 * /api/folders-author/:id:
 *   get:
 *     summary: Перевірка, чи є поточний користувач автором папки
 *     tags: [Folders]
 *     description: Цей метод перевіряє, чи є поточний користувач автором папки за її id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID папки, яку потрібно перевірити
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Користувач є автором папки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthor:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Користувач не є автором папки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthor:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Помилка при перевірці автора папки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error checking folder author"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
  public async checkIfUserIsAuthor({ params, auth, response }: HttpContextContract) {
    try {
      // Отримуємо поточного користувача
      const user = await auth.authenticate()

      // Отримуємо ID папки з параметрів запиту
      const folderId = params.id

      // Перевіряємо, чи є користувач автором папки
      const folder = await Folder.query()
        .where('folderId', folderId)
        .where('userId', user.userId) // Перевіряємо, чи належить папка поточному користувачу
        .first()

      if (folder) {
        return response.status(200).json({ isAuthor: true }) // Користувач є автором папки
      } else {
        return response.status(404).json({ isAuthor: false }) // Користувач не є автором папки
      }
    } catch (error) {
      return response.status(500).json({ message: 'Error checking folder author', error })
    }
  }
}
