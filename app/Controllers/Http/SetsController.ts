import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Set from 'App/Models/Set'
import { DateTime } from 'luxon'

export default class SetsController {
  /**
   * @swagger
   * /api/sets:
   *   post:
   *     summary: Create a new set
   *     tags: [Sets]
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
   *                 example: "My Set"
   *               access:
   *                 type: boolean
   *                 example: true
   *               level_id:
   *                 type: integer
   *                 example: 1
   *               shared:
   *                 type: boolean
   *                 example: false
   *     responses:
   *       201:
   *         description: Set created successfully
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
   *         description: Failed to create set
   */
  // Create a new set
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()

      const data = request.only(['name', 'access', 'level_id', 'shared'])
      const set = await Set.create({
        ...data,
        userId: user.userId,
        data: DateTime.local() // Setting the current date
      })
      return response.status(201).json({ message: 'Set created successfully', set })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create set', error })
    }
  }



  /**
   * @swagger
   * /api/sets/questions:
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
      const set = await Set.query()
        .where('QuestionSet_id', setId)
        .where('userId', user.userId)
        .firstOrFail()

      const data = request.only(['name', 'access', 'level_id', 'shared'])
      data.access = data.access === 'true';
      data.shared = data.shared === 'true';
      set.merge(data)
      await set.save()

      return response.status(200).json({ message: 'Set updated successfully', set })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update set', error })
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
  public async index({ response }: HttpContextContract) {
    try {
      const sets = await Set.all()
      return response.status(200).json(sets)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve sets', error })
    }
  }
}
