import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Level from 'App/Models/Level'

export default class LevelController {
  /**
   * @swagger
   * /levels:
   *   post:
   *     summary: Create a new level
   *     tags: [Levels]
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
   *                 example: "Beginner"
   *     responses:
   *       201:
   *         description: Level created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 level:
   *                   $ref: '#/components/schemas/Level'
   *       500:
   *         description: Failed to create level
   */
  // Create a new level
  public async create({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['name'])
      const level = await Level.create(data)

      return response.status(201).json({
        message: 'Level created successfully',
        level,
      })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create level', error })
    }
  }


  /**
   * @swagger
   * /levels:
   *   get:
   *     summary: Read all levels
   *     tags: [Levels]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Levels retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Level'
   *       500:
   *         description: Failed to fetch levels
   */
  // Read all levels
  public async index({ response }: HttpContextContract) {
    try {
      const levels = await Level.all()
      return response.status(200).json(levels)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to fetch levels', error })
    }
  }


  /**
   * @swagger
   * /levels/{id}:
   *   get:
   *     summary: Read a single level by ID
   *     tags: [Levels]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The level ID
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Level retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Level'
   *       404:
   *         description: Level not found
   */
  // Read a single level by ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const level = await Level.findOrFail(params.id)
      return response.status(200).json(level)
    } catch (error) {
      return response.status(404).json({ message: 'Level not found' })
    }
  }


  /**
   * @swagger
   * /levels/{id}:
   *   put:
   *     summary: Update a level by ID
   *     tags: [Levels]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The level ID
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
   *                 example: "Intermediate"
   *     responses:
   *       200:
   *         description: Level updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 level:
   *                   $ref: '#/components/schemas/Level'
   *       404:
   *         description: Level not found
   *       500:
   *         description: Failed to update level
   */
  // Update a level by ID
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const level = await Level.findOrFail(params.id)
      level.name = request.input('name')
      await level.save()

      return response.status(200).json({
        message: 'Level updated successfully',
        level,
      })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update level', error })
    }
  }

  /**
   * @swagger
   * /levels/{id}:
   *   delete:
   *     summary: Delete a level by ID
   *     tags: [Levels]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The level ID
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Level deleted successfully
   *       404:
   *         description: Level not found
   *       500:
   *         description: Failed to delete level
   */
  // Delete a level by ID
  public async delete({ params, response }: HttpContextContract) {
    try {
      const level = await Level.findOrFail(params.id)
      await level.delete()

      return response.status(200).json({
        message: 'Level deleted successfully',
      })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete level', error })
    }
  }
}
