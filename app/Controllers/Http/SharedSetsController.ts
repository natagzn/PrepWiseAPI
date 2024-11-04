import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SharedSet from 'App/Models/SharedSet'

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
    try {
      const sharedSet = await SharedSet.find(params.id)

      if (!sharedSet) {
        return response.notFound({ message: 'SharedSet not found' })
      }

      await sharedSet.delete()
      return response.status(200).json({ message: 'SharedSet deleted successfully' })
      //return response.noContent({ message: 'SharedSet deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to delete SharedSet', error: error.message })
    }
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
}
