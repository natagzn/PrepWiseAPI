import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Set from 'App/Models/Set'
import { DateTime } from 'luxon'
import CategoryInSet from 'App/Models/CategoryInSet';
import Favourite from 'App/Models/Favorite';



export default class SetsController {
  

/**
 * @swagger
 * /api/sets:
 *   post:
 *     summary: Create set
 *     description: Дозволяє аутентифікованому користувачу створити новий сет з можливістю додавання до 3 категорій. Всі характеристики не є обов'язковими для стоворення, обов'язково вказати назву
 *     tags:
 *       - Sets
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
 *                 description: Назва сету
 *                 example: "My Set"
 *                 required: true
 *               access:
 *                 type: boolean
 *                 description: Відкритість сету для інших користувачів (необов'язково)
 *                 example: false
 *               level_id:
 *                 type: integer
 *                 description: Ідентифікатор рівня (необов'язково)
 *                 example: 3
 *               shared:
 *                 type: boolean
 *                 description: Прапорець для визначення, чи буде сет спільним (необов'язково)
 *                 example: false
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Масив ідентифікаторів категорій, що додаються до сету (максимум 3)
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: Сет успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Set created successfully"
 *                 set:
 *                   $ref: '#/components/schemas/Set'
 *       400:
 *         description: Занадто багато категорій або помилка валідації
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Максимум 3 категорії можна додати до сету"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create set"
 *                 error:
 *                   type: object
 */

  // Create a new set
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
  
      // Отримання даних для створення сету, включаючи масив категорій
      const data = request.only(['name', 'access', 'level_id', 'shared']);
      const categories = request.input('categories');
  
      if (categories && categories.length > 3) {
        return response.status(400).json({ message: 'Максимум 3 категорії можна додати до сету' });
      }
  
      // Створення сету
      const set = await Set.create({
        ...data,
        userId: user.userId,
        data: DateTime.local()
      });
  
      // Додавання категорій до таблиці `CategoryInSet`
      if (categories) {
        for (const categoryId of categories) {
          await CategoryInSet.create({
            questionSetId: set.QuestionSet_id,
            categoryId
          });
        }
      }
  
      return response.status(201).json({ message: 'Set created successfully', set });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create set', error });
    }
  }
  




  /**
 * @swagger
 * /api/sets/{id}:
 *   get:
 *     summary: Get set by Id
 *     tags: [Sets]
 *     description: Отримує деталі про сет, включаючи його назву, рівень, категорії, автора, дату створення, питання, тип доступу та інформацію про вподобаність.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID сету, який потрібно отримати.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успішно отримано деталі сету.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Назва сету.
 *                 level:
 *                   type: object
 *                   properties:
 *                     levelId:
 *                       type: integer
 *                       description: ID рівня.
 *                     name:
 *                       type: string
 *                       description: Назва рівня.
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID категорії.
 *                       name:
 *                         type: string
 *                         description: Назва категорії.
 *                 author:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: Ім'я автора сету.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Дата створення сету.
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionId:
 *                         type: integer
 *                         description: ID питання.
 *                       content:
 *                         type: string
 *                         description: Текст питання.
 *                 access:
 *                   type: string
 *                   enum: [public, private]
 *                   description: Тип доступу до сету.
 *                 isFavourite:
 *                   type: boolean
 *                   description: true, якщо сет вподобаний поточним користувачем, інакше false.
 *       404:
 *         description: Сет не знайдено.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Set not found"
 */

  public async show({ params, auth, response }: HttpContextContract) {
    try {
      // Аутентифікація користувача
      const user = await auth.authenticate();

      // Отримання сету за його ID
      const set = await Set.query()
        .where('QuestionSet_id', params.id)
        .preload('user') // Загрузка автора сету
        .preload('level') // Загрузка рівня сету
        .preload('questions') // Загрузка питань сету
        .firstOrFail();

      // Отримуємо категорії, які відносяться до цього сету
      const categories = await CategoryInSet.query()
        .where('questionSetId', set.QuestionSet_id)
        .preload('category') // Загрузка категорії
        .exec();

      // Перевірка, чи вподобаний сет поточним користувачем
      const isFavourite = await Favourite.query()
        .where('questionListId', set.QuestionSet_id)
        .andWhere('userId', user.userId)
        .first();

      // Формуємо відповідь
      return response.status(200).json({
        name: set.name,
        level: {
          levelId: set.levelId,
          name: set.level?.name // Ім'я рівня
        },
        categories: categories.map(cat => ({
          id: cat.categoryId,
          name: cat.category?.name // Ім'я категорії
        })),
        author: {
          username: set.user?.username // Ім'я автора
        },
        createdAt: set.createdAt,
        questions: set.questions, // Масив питань
        access: set.access ? 'public' : 'private', // Тип доступу
        isFavourite: !!isFavourite // Чи вподобаний сет
      });
    } catch (error) {
      return response.status(404).json({ message: 'Set not found' });
    }
  }











  


  /**
   * @swagger
   * /api/sets/{setId}/categories/{categoryId}:
   *   delete:
   *     summary: Remove a category from a set
   *     tags: [Categories, Sets]
   *     parameters:
   *       - in: path
   *         name: setId
   *         required: true
   *         schema:
   *           type: integer
   *         description: The set ID
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: integer
   *         description: The category ID
   *     responses:
   *       200:
   *         description: Category removed from set successfully
   *       500:
   *         description: Failed to remove category from set
   */
  public async removeCategoryFromSet({ params, response }: HttpContextContract) {
    try {
      const categoryInSet = await CategoryInSet.query()
        .where('questionSetId', params.setId)
        .andWhere('categoryId', params.categoryId)
        .firstOrFail();
      
      await categoryInSet.delete();
      return response.status(200).json({ message: 'Category removed from set successfully' });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to remove category from set', error });
    }
  }



  /**
   * @swagger
   * /api/setsAll:
   *   get:
   *     summary: Retrieve all user sets with questions
   *     tags: [Sets]
   *     security:
   *       - bearerAuth: []  
   *     responses:
   *       200:
   *         description: Sets retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Set'
   *       500:
   *         description: Failed to retrieve sets with questions
   */
  public async getUserSetsWithQuestions({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const sets = await Set.query()
        .where('userId', user.userId)
        .preload('questions'); // Попередньо завантажуємо питання

      return response.status(200).json(sets);
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve sets with questions', error });
    }
  }


  /**
   * @swagger
   * /api/sets/{id}:
   *   put:
   *     summary: Update a set
   *     description: не обов'язково передавати всі поля
   *     tags: [Sets]
   *     security:
   *       - bearerAuth: []  
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The set ID
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
   *                 example: "Updated Set"
   *               access:
   *                 type: boolean
   *                 example: false
   *               level_id:
   *                 type: integer
   *                 example: 2
   *               shared:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Set updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 set:
   *                   $ref: '#/components/schemas/Set'
   *       500:
   *         description: Failed to update set
   */
  public async update({ auth, request, params, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const setId = params.id
  
      // сет, який належить поточному користувачу
      const set = await Set.query()
        .where('QuestionSet_id', setId)
        .where('userId', user.userId)
        .first()
  
      console.log('Found set:', set)
  
      if (!set) {
        return response.status(404).json({ message: 'Set not found' })
      }
  
      const data = request.only(['name', 'access', 'level_id', 'shared'])
  
      data.access = data.access === 'true';
      data.shared = data.shared === 'true';
  
      set.merge(data)
      await set.save()
  
      console.log('Checking access change to false, and deleting favourites for setId:', setId)
  
      if (data.access === false) {
        const deletedFavourites = await Favourite.query()
          .where('questionListId', setId) 
          .delete() 
        console.log('Deleted favourites:', deletedFavourites)
      }
  
      return response.status(200).json({ message: 'Set updated successfully', set })
    } catch (error) {
      console.error('Error updating set:', error)
  
      return response.status(500).json({ message: 'Failed to update set', error: error.message })
    }
  }
  


  /**
   * @swagger
   * /api/sets/{id}:
   *   delete:
   *     summary: Delete a set
   *     tags: [Sets]
   *     security:
   *       - bearerAuth: []  
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The set ID
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Set deleted successfully
   *       500:
   *         description: Failed to delete set
   */
public async delete({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const setId = params.id
      const set = await Set.query()
        .where('QuestionSet_id', setId)
        .where('userId', user.userId)
        .firstOrFail()

      await set.delete()
      return response.status(200).json({ message: 'Set deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete set', error })
    }
  }

  

  
  // Get all sets
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const sets = await Set.query().where('userId', user.userId)

      return response.status(200).json(sets)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve sets', error })
    }
  }
}
