import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Subscription from 'App/Models/Subscription'


export default class SubscriptionsController {



  public async create({auth, request, response }: HttpContextContract) {
    try {
      const userId = (await auth.authenticate()).userId
      const { typeId } = request.only(['typeId'])
  
      // Визначення дати наступного місяця
      const nextMonthDate = DateTime.local().plus({ months: 1 })
  
      // Створення нового запису підписки
      const subscription = await Subscription.create({
        typeId,
        userId,
        date: nextMonthDate, // Встановлення дати наступного місяця
      })
  
      return response.status(201).json({
        message: 'Subscription created successfully',
        subscription,
      })
    } catch (error) {
      console.error('Error creating subscription:', error)
      return response.status(500).json({ message: 'Failed to create subscription', error: error.message })
    }
  }
}
