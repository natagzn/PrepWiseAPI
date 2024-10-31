import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Set from 'App/Models/Set'
import { DateTime } from 'luxon'
import Question from 'App/Models/Question'

export default class SetsController {
  
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



  
  // Get a set by ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const set = await Set.findOrFail(params.id)
      return response.status(200).json(set)
    } catch (error) {
      return response.status(404).json({ message: 'Set not found' })
    }
  }

  // Update a set by ID
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const set = await Set.findOrFail(params.id)
      const data = request.only(['name', 'access', 'data', 'level_id', 'shared'])
      set.merge(data)
      await set.save()
      return response.status(200).json({ message: 'Set updated successfully', set })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update set', error })
    }
  }

  // Delete a set by ID
  public async delete({ params, response }: HttpContextContract) {
    try {
      const set = await Set.findOrFail(params.id)
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
