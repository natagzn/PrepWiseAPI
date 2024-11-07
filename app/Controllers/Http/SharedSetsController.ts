import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SharedSet from 'App/Models/SharedSet'
import Database from '@ioc:Adonis/Lucid/Database';
import SetModel from 'App/Models/Set'

//import User from 'App/Models/User'
//import CategoryInSet from 'App/Models/CategoryInSet'
import Category from 'App/Models/Category'


export default class SharedSetsController {
  /**
   * @swagger
   * /api/shared-sets:
   *   post:
   *     summary: Create a new SharedSet
   *     tags: [SharedSets]
   *     security:
   *       - bearerAuth: []  # Користувач повинен бути авторизований
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               setId:
   *                 type: integer
   *               userId:
   *                 type: integer
   *               edit:
   *                 type: boolean
   *             required:
   *               - setId
   *               - userId
   *     responses:
   *       201:
   *         description: SharedSet created successfully
   *       500:
   *         description: Failed to create SharedSet
   */
  // Створення нового запису
  public async create({ request, response }: HttpContextContract) {
    try {
      const { setId, userId, edit } = request.all()

      const isEdit = edit === 'true' || edit === true;

      const sharedSet = await SharedSet.create({
        setId,
        userId,
        edit: isEdit,
      })

      await Database
      .from('sets')
      .where('question_set_id', setId)
      .update({ shared: true });

      return response.created({ message: 'SharedSet created successfully', sharedSet })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to create SharedSet', error: error.message })
    }
  }


  /**
   * @swagger
   * /api/shared-sets:
   *   get:
   *     summary: Retrieve all SharedSets
   *     tags: [SharedSets]
   *     security:
   *       - bearerAuth: []  # Користувач повинен бути авторизований
   *     responses:
   *       200:
   *         description: SharedSets retrieved successfully
   *       500:
   *         description: Failed to retrieve SharedSets
   */
  // Отримання всіх записів
  public async index({ response }: HttpContextContract) {
    try {
      const sharedSets = await SharedSet.all()
      return response.ok({ message: 'SharedSets retrieved successfully', sharedSets })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to retrieve SharedSets', error: error.message })
    }
  }


  /**
   * @swagger
   * /api/shared-sets/{id}:
   *   get:
   *     summary: Retrieve a specific SharedSet
   *     tags: [SharedSets]
   *     security:
   *       - bearerAuth: []  # Користувач повинен бути авторизований
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the SharedSet
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: SharedSet retrieved successfully
   *       404:
   *         description: SharedSet not found
   *       500:
   *         description: Failed to retrieve SharedSet
   */
  // Отримання одного запису
  public async show({ params, response }: HttpContextContract) {
    try {
      const sharedSet = await SharedSet.find(params.id)

      if (!sharedSet) {
        return response.notFound({ message: 'SharedSet not found' })
      }

      return response.ok({ message: 'SharedSet retrieved successfully', sharedSet })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to retrieve SharedSet', error: error.message })
    }
  }


  /**
   * @swagger
   * /api/shared-sets/{id}:
   *   put:
   *     summary: Update a specific SharedSet
   *     tags: [SharedSets]
   *     security:
   *       - bearerAuth: []  # Користувач повинен бути авторизований
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the SharedSet
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               edit:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: SharedSet updated successfully
   *       404:
   *         description: SharedSet not found
   *       500:
   *         description: Failed to update SharedSet
   */
  // Оновлення запису
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const sharedSet = await SharedSet.find(params.id)
  
      if (!sharedSet) {
        return response.notFound({ message: 'SharedSet not found' })
      }
  
      const { edit } = request.all()
  
      // Перетворюємо значення edit на boolean
      const isEdit = edit === 'true' || edit === true;
  
      // Обновлюємо поле edit
      sharedSet.merge({
        ...request.all(),
        edit: isEdit,
      });
  
      await sharedSet.save()
  
      return response.ok({ message: 'SharedSet updated successfully', sharedSet })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to update SharedSet', error: error.message })
    }
  }



  /**
   * @swagger
   * /api/shared-sets/{id}:
   *   delete:
   *     summary: Delete a specific SharedSet
   *     tags: [SharedSets]
   *     security:
   *       - bearerAuth: []  # Користувач повинен бути авторизований
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the SharedSet
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: SharedSet deleted successfully
   *       404:
   *         description: SharedSet not found
   *       500:
   *         description: Failed to delete SharedSet
   */
  // Видалення запису
  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params

    const sharedSet = await SharedSet.find(id)
    if (!sharedSet) {
      return response.status(404).json({ message: 'Shared set not found' })
    }

    const setId = sharedSet.setId
    await sharedSet.delete()

    // Перевірка, чи є ще записи в SharedSets для цього `setId`
    const remainingSharedSets = await SharedSet.query().where('set_id', setId)
    if (remainingSharedSets.length === 0) {
      // Якщо це останній запис, оновлюємо поле `shared` в Sets
      const set = await SetModel.find(setId)
      if (set && set.shared) {
        set.shared = false
        await set.save()
      }
    }

    return response.json({ message: 'Shared set deleted successfully' })
  }
  



  /**
   * @swagger
   * /api/shared-sets/{id}/author:
   *   get:
   *     summary: Retrieve the author ID of a SharedSet
   *     tags: [SharedSets]
   *     security:
   *       - bearerAuth: []  
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the SharedSet
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Author ID retrieved successfully
   *       404:
   *         description: SharedSet or associated Set not found
   *       500:
   *         description: Failed to retrieve author ID
   */
  // Запит для отримання ID автора поширеного сету
  public async getAuthorId({ params, response }: HttpContextContract) {
    try {
      const sharedSet = await SharedSet.query()
        .where('id', params.id)
        .preload('set', (query) => {
          query.preload('user')
        })
        .first()

      if (!sharedSet || !sharedSet.set) {
        return response.notFound({ message: 'SharedSet or associated Set not found' })
      }

      const authorId = sharedSet.set.userId
      return response.ok({ message: 'Author ID retrieved successfully', authorId })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to retrieve author ID', error: error.message })
    }
  }


  /*public async getSharedSets({ auth, response }: HttpContextContract) {
    try {
        const user = await auth.authenticate(); // Аутентифікація користувача

        // Отримуємо всі SharedSet записи для поточного користувача
        const sharedSets = await SharedSet.query()
            .where('user_id', user.userId)
            .preload('set', (setQuery) => {
                setQuery
                    .preload('user') // Завантаження автора сета
                    .preload('questions') // Завантаження питань в сеті
                    .preload('level') // Завантаження рівня сета
            })

        // Обробка кожного сета для додаткового завантаження категорій
        const setsWithCategories = await Promise.all(
            sharedSets.map(async (sharedSet) => {
                const set = sharedSet.set;

                // Знаходимо категорії для кожного сета
                const categories = await Category.query()
                    .whereIn('category_id', (query) => {
                        query.from('category_in_sets')
                            .where('question_set_id', set.QuestionSet_id)
                            .select('category_id')
                    })
                    .preload('resources') // Завантаження ресурсів кожної категорії

                return {
                    ...set.serialize(),
                    author: set.user, // Автор сета
                    categories: categories.map(category => category.serialize()) // Категорії сета
                };
            })
        );

        return response.status(200).json({
            sharedSets: setsWithCategories,
        });
    } catch (error) {
        return response.status(500).json({ message: 'Error retrieving shared sets', error });
    }
}*/






public async getSharedSets({ auth, response }: HttpContextContract) {
  try {
      const user = await auth.authenticate(); // Аутентифікація користувача

      // Отримуємо всі SharedSet записи для поточного користувача
      const sharedSets = await SharedSet.query()
          .where('user_id', user.userId) // Користувач, який отримав доступ
          .preload('set', (setQuery) => {
              setQuery
                  .preload('user') // Завантаження автора сета
                  .preload('questions') // Завантаження питань у сеті
                  .preload('level') // Завантаження рівня сета
          })
          .preload('user') // Завантаження користувача, якому поширили сет

      // Обробка кожного сета для додаткового завантаження категорій
      const setsWithCategories = await Promise.all(
          sharedSets.map(async (sharedSet) => {
              const set = sharedSet.set;

              // Знаходимо категорії для кожного сета
              const categories = await Category.query()
                  .whereIn('category_id', (query) => {
                      query.from('category_in_sets')
                          .where('question_set_id', set.QuestionSet_id)
                          .select('category_id')
                  })

              return {
                  ...set.serialize(),
                  author: set.user, // Автор сета
                  sharedWithUser: sharedSet.user, // Користувач, якому поширили сет
                  editPermission: sharedSet.edit, // Права редагування
                  categories: categories.map(category => category.serialize()) // Категорії сета
              };
          })
      );

      return response.status(200).json({
          sharedSets: setsWithCategories,
      });
  } catch (error) {
      return response.status(500).json({ message: 'Error retrieving shared sets', error });
  }
}
}
