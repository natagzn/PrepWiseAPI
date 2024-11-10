import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TypeNotification from 'App/Models/TypesNotification'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class TypesNotificationsController {
  /**
 * @swagger
 * /api/types_notifications:
 *   get:
 *     summary: Отримати всі типи сповіщень
 *     tags:
 *       - TypesNotifications
 *     responses:
 *       200:
 *         description: Успішно отримано список всіх типів сповіщень
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TypeNotification'
 */
  public async index({ response }: HttpContextContract) {
    const types = await TypeNotification.all()
    return response.status(200).json({ data: types })
  }

  /**
 * @swagger
 * /api/types_notifications:
 *   post:
 *     summary: Створити новий тип сповіщення
 *     tags:
 *       - TypesNotifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Notification Type"
 *     responses:
 *       201:
 *         description: Тип сповіщення успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "TypeNotification created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TypeNotification'
 */
  public async create({ request, response }: HttpContextContract) {
    const typeNotificationSchema = schema.create({
      name: schema.string(),
    })

    const payload = await request.validate({ schema: typeNotificationSchema })

    const type = await TypeNotification.create(payload)
    return response.status(201).json({
      message: 'TypeNotification created successfully',
      data: type,
    })
  }

  /**
 * @swagger
 * /api/types_notifications/{id}:
 *   get:
 *     summary: Отримати тип сповіщення за ID
 *     tags:
 *       - TypesNotifications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID типу сповіщення
 *     responses:
 *       200:
 *         description: Успішно отримано тип сповіщення
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TypeNotification'
 *       404:
 *         description: Тип сповіщення не знайдено
 */
  public async show({ params, response }: HttpContextContract) {
    const type = await TypeNotification.find(params.id)
    if (!type) {
      return response.status(404).json({ message: 'TypeNotification not found' })
    }
    return response.status(200).json({ data: type })
  }

  /**
 * @swagger
 * /api/types_notifications/{id}:
 *   put:
 *     summary: Оновити тип сповіщення за ID
 *     tags:
 *       - TypesNotifications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID типу сповіщення
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Notification Type"
 *     responses:
 *       200:
 *         description: Тип сповіщення успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "TypeNotification updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TypeNotification'
 *       404:
 *         description: Тип сповіщення не знайдено
 */
  public async update({ params, request, response }: HttpContextContract) {
    const type = await TypeNotification.find(params.id)
    if (!type) {
      return response.status(404).json({ message: 'TypeNotification not found' })
    }

    const updateSchema = schema.create({
      name: schema.string(),
    })

    const payload = await request.validate({ schema: updateSchema })

    type.merge(payload)
    await type.save()

    return response.status(200).json({
      message: 'TypeNotification updated successfully',
      data: type,
    })
  }

  /**
 * @swagger
 * /api/types_notifications/{id}:
 *   delete:
 *     summary: Видалити тип сповіщення за ID
 *     tags:
 *       - TypesNotifications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID типу сповіщення
 *     responses:
 *       200:
 *         description: Тип сповіщення успішно видалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "TypeNotification deleted successfully"
 *       404:
 *         description: Тип сповіщення не знайдено
 */
  public async destroy({ params, response }: HttpContextContract) {
    const type = await TypeNotification.find(params.id)
    if (!type) {
      return response.status(404).json({ message: 'TypeNotification not found' })
    }

    await type.delete()
    return response.status(200).json({ message: 'TypeNotification deleted successfully' })
  }
}
