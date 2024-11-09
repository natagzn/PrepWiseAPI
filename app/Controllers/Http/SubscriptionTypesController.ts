import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubscriptionType from 'App/Models/SubscriptionType'

export default class SubscriptionTypesController {

  // CREATE: Створення нового типу підписки
  public async create({ request, response }: HttpContextContract) {
    try {
      const { name } = request.only(['name'])

      // Створення нового типу підписки
      const subscriptionType = await SubscriptionType.create({
        name,
      })

      return response.status(201).json({
        message: 'Subscription type created successfully',
        subscriptionType,
      })
    } catch (error) {
      console.error('Error creating subscription type:', error)
      return response.status(500).json({ message: 'Failed to create subscription type', error: error.message })
    }
  }

  // READ: Отримання всіх типів підписки
  public async index({ response }: HttpContextContract) {
    try {
      const subscriptionTypes = await SubscriptionType.query().preload('subscriptions') // Завантажуємо всі підписки для кожного типу

      return response.status(200).json({
        message: 'Subscription types retrieved successfully',
        data: subscriptionTypes,
      })
    } catch (error) {
      console.error('Error fetching subscription types:', error)
      return response.status(500).json({ message: 'Failed to retrieve subscription types', error: error.message })
    }
  }

  // READ: Отримання одного типу підписки за ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const subscriptionType = await SubscriptionType.query()
        .where('subscriptionTypeId', params.id)
        .preload('subscriptions') // Завантажуємо підписки для цього типу

      if (!subscriptionType) {
        return response.status(404).json({ message: 'Subscription type not found' })
      }

      return response.status(200).json({
        message: 'Subscription type retrieved successfully',
        data: subscriptionType,
      })
    } catch (error) {
      console.error('Error fetching subscription type:', error)
      return response.status(500).json({ message: 'Failed to retrieve subscription type', error: error.message })
    }
  }

  // UPDATE: Оновлення типу підписки
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const subscriptionType = await SubscriptionType.findOrFail(params.id)

      const { name } = request.only(['name'])

      subscriptionType.name = name
      await subscriptionType.save()

      return response.status(200).json({
        message: 'Subscription type updated successfully',
        subscriptionType,
      })
    } catch (error) {
      console.error('Error updating subscription type:', error)
      return response.status(500).json({ message: 'Failed to update subscription type', error: error.message })
    }
  }

  // DELETE: Видалення типу підписки
  public async delete({ params, response }: HttpContextContract) {
    try {
      const subscriptionType = await SubscriptionType.findOrFail(params.id)

      // Видалення типу підписки
      await subscriptionType.delete()

      return response.status(200).json({
        message: 'Subscription type deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting subscription type:', error)
      return response.status(500).json({ message: 'Failed to delete subscription type', error: error.message })
    }
  }
}
