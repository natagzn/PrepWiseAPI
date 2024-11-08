import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SharedSet from 'App/Models/SharedSet'
import Database from '@ioc:Adonis/Lucid/Database';
import SetModel from 'App/Models/Set'
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






/**
 * @swagger
 * /api/shared-sets-all:
 *   get:
 *     summary: Отримати списки наборів питань, поширених іншими користувачами для поточного користувача
 *     description: Повертає інформацію про набори питань, які були поширені поточному користувачу іншими користувачами. Для кожного набору виводиться автор, категорії, а також список користувачів, яким був поширений цей набір разом з їхніми правами доступу.
 *     tags:
 *       - SharedSets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішне отримання списку поширених наборів питань
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sharedSets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       setInfo:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Ідентифікатор набору питань
 *                           name:
 *                             type: string
 *                             description: Назва набору питань
 *                           shared:
 *                             type: boolean
 *                             description: Ознака, чи поширено набір
 *                           access:
 *                             type: string
 *                             description: Тип доступу до набору
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Дата створення набору
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Дата останнього оновлення набору
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Ідентифікатор автора набору
 *                           username:
 *                             type: string
 *                             description: Ім'я автора набору
 *                       sharedWithUsers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: Ідентифікатор користувача, якому був поширений набір
 *                             username:
 *                               type: string
 *                               description: Ім'я користувача, якому був поширений набір
 *                             editPermission:
 *                               type: boolean
 *                               description: Права редагування для цього користувача
 *                       isFavourite:
 *                         type: boolean
 *                         description: Ознака, чи доданий набір в обране для поточного користувача
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: Ідентифікатор категорії
 *                             name:
 *                               type: string
 *                               description: Назва категорії
 *                             description:
 *                               type: string
 *                               description: Опис категорії
 *       401:
 *         description: Неавторизований доступ, необхідно увійти в систему
 *       500:
 *         description: Внутрішня помилка сервера при отриманні наборів питань
 */


public async getSharedSets({ auth, response }: HttpContextContract) {
  try {
    const currentUser = await auth.authenticate();

    // Отримуємо всі записи SharedSet, щоб отримати інформацію про всі сети
    const sharedSets = await SharedSet.query()
      .preload('set', (setQuery) => {
        setQuery
          .preload('user') // Автор сета
          .preload('questions') // Питання у сеті
          .preload('level'); // Рівень сета
      })
      .preload('user'); // Користувач, якому поширили сет

    // Об'єкт для групування сетів за `QuestionSet_id`
    const setsMap: Record<number, any> = {};

    // Обробка кожного сета для збору даних та групування
    for (const sharedSet of sharedSets) {
      const set = sharedSet.set;

      if (!set) {
        console.error(`Set with ID ${sharedSet.setId} not found.`);
        continue;
      }

      // Додаємо або оновлюємо інформацію про сет у `setsMap`
      if (!setsMap[set.QuestionSet_id]) {
        // Отримуємо категорії для кожного сета тільки один раз
        const categories = await Category.query()
          .whereIn('category_id', (query) => {
            query.from('category_in_sets')
              .where('question_set_id', set.QuestionSet_id)
              .select('category_id');
          });

        const isFavourite = await Database
          .from('favourites')
          .where('user_id', currentUser.userId)
          .andWhere('question_list_id', set.QuestionSet_id)
          .first() ? true : false;

        setsMap[set.QuestionSet_id] = {
          setInfo: {
            id: set.QuestionSet_id,
            name: set.name,
            shared: set.shared,
            access: set.access,
            createdAt: set.createdAt,
            updatedAt: set.updatedAt,
          },
          author: {
            id: set.user.userId,
            username: set.user.username,
          },
          sharedWithUsers: [],
          isFavourite: isFavourite,
          categories: categories.map(category => category.serialize()),
        };
      }

      // Додаємо кожного користувача, кому поширено сет, до `sharedWithUsers`
      setsMap[set.QuestionSet_id].sharedWithUsers.push({
        id: sharedSet.user.userId,
        username: sharedSet.user.username,
        editPermission: sharedSet.edit,
      });
    }

    // Фільтруємо сети, до яких поточний користувач має доступ, за наявністю його ID в масиві `sharedWithUsers`
    const setsWithCurrentUser = Object.values(setsMap).filter(set => 
      set.sharedWithUsers.some(user => user.id === currentUser.userId)
    );

    return response.status(200).json({
      sharedSets: setsWithCurrentUser,
    });
  } catch (error) {
    console.error('Error retrieving shared sets:', error);
    return response.status(500).json({
      message: 'Error retrieving shared sets',
      error: error.message || error,
    });
  }
}





/**
 * @swagger
 * /api/shared-sets-by-user:
 *   get:
 *     summary: Отримати списки наборів питань, поширених поточним користувачем іншим користувачам
 *     description: Повертає інформацію про набори питань, які були поширені поточним користувачем. Для кожного набору виводиться інформація про автора, категорії, а також список користувачів, яким набір був поширений разом з їхніми правами доступу.
 *     tags:
 *       - SharedSets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішне отримання списку наборів питань, поширених поточним користувачем
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 setsSharedByUser:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       setInfo:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Ідентифікатор набору питань
 *                           shared:
 *                             type: boolean
 *                             description: Ознака, чи поширено набір
 *                           access:
 *                             type: string
 *                             description: Тип доступу до набору
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Дата створення набору
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Ідентифікатор автора набору
 *                           username:
 *                             type: string
 *                             description: Ім'я автора набору
 *                       sharedWithUsers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: Ідентифікатор користувача, якому був поширений набір
 *                             username:
 *                               type: string
 *                               description: Ім'я користувача, якому був поширений набір
 *                             editPermission:
 *                               type: boolean
 *                               description: Права редагування для цього користувача
 *                       isFavourite:
 *                         type: boolean
 *                         description: Ознака, чи доданий набір в обране для поточного користувача
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: Ідентифікатор категорії
 *                             name:
 *                               type: string
 *                               description: Назва категорії
 *                             description:
 *                               type: string
 *                               description: Опис категорії
 *       401:
 *         description: Неавторизований доступ, необхідно увійти в систему
 *       500:
 *         description: Внутрішня помилка сервера при отриманні поширених наборів питань
 */

public async getSetsSharedByCurrentUser({ auth, response }: HttpContextContract) {
  try {
    const currentUser = await auth.authenticate();

    // Отримуємо всі записи SharedSet, де поточний користувач є автором сету
    const sharedSets = await SharedSet.query()
      .preload('set', (setQuery) => {
        setQuery
          .where('user_id', currentUser.userId)
          .preload('user') // Автор сета
          .preload('questions') // Питання в сеті
          .preload('level') // Рівень сета
      })
      .preload('user'); // Користувач, якому поширили сет

    // Об'єкт для групування сетів за QuestionSet_id
    const setsMap: Record<number, any> = {};

    // Обробка кожного сета для збору даних та групування
    for (const sharedSet of sharedSets) {
      const set = sharedSet.set;

      if (!set) {
        console.error(`Set with ID ${sharedSet.setId} not found.`);
        continue;
      }

      // Отримуємо категорії для кожного сета
      const categories = await Category.query()
        .whereIn('category_id', (query) => {
          query.from('category_in_sets')
            .where('question_set_id', set.QuestionSet_id)
            .select('category_id');
        });

      const isFavourite = await Database
        .from('favourites')
        .where('user_id', currentUser.userId)
        .andWhere('question_list_id', set.QuestionSet_id)
        .first() ? true : false;

      // Додаємо або оновлюємо інформацію про сет в `setsMap`
      if (!setsMap[set.QuestionSet_id]) {
        // Якщо ще не існує запису для цього сета, додаємо його
        setsMap[set.QuestionSet_id] = {
          setInfo: {
            id: set.QuestionSet_id,
            shared: set.shared,
            access: set.access,
            createdAt: set.createdAt,
          },
          author: {
            id: set.user.userId,
            username: set.user.username,
          },
          sharedWithUsers: [],
          isFavourite: isFavourite,
          categories: categories.map(category => category.serialize()),
        };
      }

      // Додаємо інформацію про користувача, якому поширено сет, до sharedWithUsers
      setsMap[set.QuestionSet_id].sharedWithUsers.push({
        id: sharedSet.user.userId,
        username: sharedSet.user.username,
        editPermission: sharedSet.edit,
      });
    }

    // Конвертуємо об'єкт setsMap у масив для зручного виведення
    const setsWithFullDetails = Object.values(setsMap);

    return response.status(200).json({
      setsSharedByUser: setsWithFullDetails,
    });
  } catch (error) {
    console.error('Error retrieving shared sets:', error);
    return response.status(500).json({
      message: 'Error retrieving shared sets',
      error: error.message || error,
    });
  }
}










/**
 * @swagger
 * /api/shared-sets-author/{id}:
 *   get:
 *     summary: Перевірка доступу поточного користувача до заданого набору
 *     description: Метод перевіряє, чи є поточний користувач автором або співредактором конкретного набору запитань.
 *     tags:
 *       - Sets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ідентифікатор набору запитань
 *     responses:
 *       200:
 *         description: Інформація про доступ до набору
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthor:
 *                   type: boolean
 *                   description: Чи є поточний користувач автором набору
 *                 UserCanEdit:
 *                   type: boolean
 *                   nullable: true
 *                   description: Якщо користувач не автор, то це поле вказує, чи має він право на редагування. Значення `null` означає, що користувач не є співредактором.
 *               example:
 *                 isAuthor: false
 *                 UserCanEdit: true
 *       400:
 *         description: Набір не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Set ID is required"
 *       404:
 *         description: Набір не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Set not found"
 *       500:
 *         description: Помилка на сервері
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error checking user access"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

public async checkUserAccess({ auth, params, response }: HttpContextContract) {
  try {
    const user = await auth.authenticate();
    const setId = params.id;

    // Отримуємо набір за його ID
    const set = await Database
    .from('sets')
    .select('*')
    .where('question_set_id', setId)
    .first();

    // Перевіряємо, чи існує набір
    if (!set) {
      return response.status(404).json({ message: 'Set not found' });
    }

    // Перевіряємо, чи поточний користувач є автором набору
    if (set.user_id === user.userId) {
      return response.status(200).json({
        isAuthor: true,
        UserCanEdit: null, // Для автора UserCanEdit не потрібне
      });
    }

    // Якщо користувач не є автором, перевіряємо, чи є він співредактором
    const sharedSet = await SharedSet.query()
      .where('set_id', setId)
      .andWhere('user_id', user.userId)
      .first();

    if (sharedSet) {
      return response.status(200).json({
        isAuthor: false,
        UserCanEdit: sharedSet.edit, // true або false залежно від прав редагування
      });
    }

    // Якщо користувач не є ні автором, ні співредактором
    return response.status(200).json({
      isAuthor: false,
      UserCanEdit: null, // Користувач не має доступу
    });
  } catch (error) {
    console.error('Error checking user access:', error);
    return response.status(500).json({ message: 'Error checking user access', error });
  }
}
}
