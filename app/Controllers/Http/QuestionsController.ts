import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question'

export default class QuestionsController {
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

  // Get a question by ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const question = await Question.findOrFail(params.id)
      return response.status(200).json(question)
    } catch (error) {
      return response.status(404).json({ message: 'Question not found' })
    }
  }

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
