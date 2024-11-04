import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question'

export default class QuestionsController {
  /**
   * @swagger
   * /api/questions:
   *   post:
   *     summary: Create a new question
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               list_id:
   *                 type: integer
   *                 description: ID of the list the question belongs to
   *               status:
   *                 type: string
   *                 description: Status of the question
   *               content:
   *                 type: string
   *                 description: Content of the question
   *               answer:
   *                 type: string
   *                 description: Answer to the question
   *     responses:
   *       201:
   *         description: Question created successfully
   *       500:
   *         description: Failed to create question
   */
  // Create a new question
  public async create({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['list_id', 'status', 'content', 'answer'])
      const question = await Question.create(data)
      return response.status(201).json({ message: 'Question created successfully', question })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create question', error })
    }
  }



  /**
   * @swagger
   * /api/questions/{id}:
   *   get:
   *     summary: Get a question by ID
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the question
   *     responses:
   *       200:
   *         description: Question retrieved successfully
   *       404:
   *         description: Question not found
   */

  // Get a question by ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const question = await Question.findOrFail(params.id)
      return response.status(200).json(question)
    } catch (error) {
      return response.status(404).json({ message: 'Question not found' })
    }
  }


  /**
   * @swagger
   * /api/questions/{id}:
   *   put:
   *     summary: Update a question by ID
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the question
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               list_id:
   *                 type: integer
   *                 description: ID of the list the question belongs to
   *               status:
   *                 type: string
   *                 description: Status of the question
   *               content:
   *                 type: string
   *                 description: Content of the question
   *               answer:
   *                 type: string
   *                 description: Answer to the question
   *     responses:
   *       200:
   *         description: Question updated successfully
   *       500:
   *         description: Failed to update question
   */
  // Update a question by ID
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const question = await Question.findOrFail(params.id)
      const data = request.only(['list_id', 'status', 'content', 'answer'])
      question.merge(data)
      await question.save()
      return response.status(200).json({ message: 'Question updated successfully', question })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update question', error })
    }
  }


  /**
   * @swagger
   * /api/questions/{id}:
   *   delete:
   *     summary: Delete a question by ID
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the question
   *     responses:
   *       200:
   *         description: Question deleted successfully
   *       500:
   *         description: Failed to delete question
   */
  // Delete a question by ID
  public async delete({ params, response }: HttpContextContract) {
    try {
      const question = await Question.findOrFail(params.id)
      await question.delete()
      return response.status(200).json({ message: 'Question deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete question', error })
    }
  }



  /**
   * @swagger
   * /api/questions:
   *   get:
   *     summary: Get all questions
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Questions retrieved successfully
   *       500:
   *         description: Failed to retrieve questions
   */
  // Get all questions
  public async index({ response }: HttpContextContract) {
    try {
      const questions = await Question.all()
      return response.status(200).json(questions)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve questions', error })
    }
  }
}
