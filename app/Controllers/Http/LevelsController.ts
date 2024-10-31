import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Level from 'App/Models/Level'

export default class LevelController {
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

  // Read all levels
  public async index({ response }: HttpContextContract) {
    try {
      const levels = await Level.all()
      return response.status(200).json(levels)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to fetch levels', error })
    }
  }

  // Read a single level by ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const level = await Level.findOrFail(params.id)
      return response.status(200).json(level)
    } catch (error) {
      return response.status(404).json({ message: 'Level not found' })
    }
  }

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
