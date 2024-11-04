import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Resource from 'App/Models/Resource'
import { DateTime } from 'luxon'

export default class ResourcesController {
  /**
   * @swagger
   * /api/resources:
   *   post:
   *     summary: Create a new resource
   *     tags: [Resources]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               levelId:
   *                 type: integer
   *               categoryId:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Resource created successfully
   *       500:
   *         description: Failed to create resource
   */
  
  // Створення нового ресурсу
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const data = request.only(['title', 'description', 'levelId', 'categoryId'])

      const resource = await Resource.create({
        ...data,
        userId: user.userId,
        data: DateTime.local() // Встановлюємо поточну дату
      })

      return response.status(201).json({ message: 'Resource created successfully', resource })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create resource', error })
    }
  }

  /**
   * @swagger
   * /api/resources:
   *   get:
   *     summary: Retrieve all resources
   *     tags: [Resources]
   *     responses:
   *       200:
   *         description: Resources retrieved successfully
   *       500:
   *         description: Failed to retrieve resources
   */
  // Отримання всіх ресурсів
  public async index({ response }: HttpContextContract) {
    try {
      const resources = await Resource.query().preload('user').preload('level').preload('likes')
      return response.status(200).json(resources)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve resources', error })
    }
  }


  /**
   * @swagger
   * /api/resources/{id}:
   *   get:
   *     summary: Retrieve a resource by ID
   *     tags: [Resources]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The resource ID
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Resource retrieved successfully
   *       404:
   *         description: Resource not found
   */
  // Отримання ресурсу за ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const resource = await Resource.query()
        .where('resourceId', params.id)
        .preload('user')
        .preload('level')
        .preload('likes')
        .firstOrFail()

      return response.status(200).json(resource)
    } catch (error) {
      return response.status(404).json({ message: 'Resource not found', error })
    }
  }



  /**
   * @swagger
   * /api/resources/{id}:
   *   put:
   *     summary: Update a resource
   *     tags: [Resources]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The resource ID
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               levelId:
   *                 type: integer
   *               categoryId:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Resource updated successfully
   *       403:
   *         description: Unauthorized to update this resource
   *       500:
   *         description: Failed to update resource
   */
  // Оновлення ресурсу
  public async update({ auth, params, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const resource = await Resource.findOrFail(params.id)

      if (resource.userId !== user.userId) {
        return response.status(403).json({ message: 'Unauthorized to update this resource' })
      }

      resource.merge(request.only(['title', 'description', 'levelId', 'category']))
      await resource.save()

      return response.status(200).json({ message: 'Resource updated successfully', resource })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update resource', error })
    }
  }




  /**
   * @swagger
   * /api/resources/{id}:
   *   delete:
   *     summary: Delete a resource
   *     tags: [Resources]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The resource ID
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Resource deleted successfully
   *       403:
   *         description: Unauthorized to delete this resource
   *       500:
   *         description: Failed to delete resource
   */
  // Видалення ресурсу
  public async delete({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const resource = await Resource.findOrFail(params.id)

      if (resource.userId !== user.userId) {
        return response.status(403).json({ message: 'Unauthorized to delete this resource' })
      }

      await resource.delete()

      return response.status(200).json({ message: 'Resource deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete resource', error })
    }
  }
}
