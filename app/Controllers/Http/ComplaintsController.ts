import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Complaint from 'App/Models/Complaint'

export default class ComplaintsController {
  /**
   * @swagger
   * /api/complaints:
   *   post:
   *     summary: Створення скарги
   *     tags:
   *       - Complaints
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userIdCompl:
   *                 type: integer
   *                 description: ID користувача, на якого подана скарга
   *               resourcesId:
   *                 type: integer
   *                 description: ID ресурсу, на який подана скарга
   *               setId:
   *                 type: integer
   *                 description: ID набору, на який подана скарга
   *               context:
   *                 type: string
   *                 description: Зміст скарги
   *     responses:
   *       201:
   *         description: Скаргу створено успішно
   *       400:
   *         description: Одне з полів userIdCompl, resourcesId або setId повинно бути заповнене
   */
  public async create({ request, auth, response }: HttpContextContract) {
    const userId = auth.user?.userId;
    const userIdCompl = request.input('userIdCompl');
    const resourcesId = request.input('resourcesId');
    const setId = request.input('setId');
    const context = request.input('context');

    if (!userIdCompl && !resourcesId && !setId) {
      return response.badRequest({
        message: 'Принаймні одне з полів: userIdCompl, resourcesId, або setId повинно бути заповнене.',
      });
    }

    const complaint = await Complaint.create({
      userId: userId,
      userIdCompl,
      resourcesId,
      setId,
      context,
    });

    return response.created(complaint);
  }

  /**
   * @swagger
   * /api/complaints:
   *   get:
   *     summary: Отримання всіх скарг
   *     tags:
   *       - Complaints
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Успішно отримано всі скарги
   *       400:
   *         description: Не вдалося отримати скарги
   */
  public async index({ response }: HttpContextContract) {
    try {
      const complaints = await Complaint.query()
        .preload('user')
        .preload('complainedUser')
        .preload('resource')
        .preload('set');
      return response.ok({ data: complaints });
    } catch (error) {
      return response.badRequest({ message: 'Failed to fetch complaints', error });
    }
  }

  /**
   * @swagger
   * /api/complaints/{id}:
   *   get:
   *     summary: Отримання скарги за ID
   *     tags:
   *       - Complaints
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID скарги
   *     responses:
   *       200:
   *         description: Успішно знайдено скаргу
   *       404:
   *         description: Скаргу не знайдено
   */
  public async show({ params, response }: HttpContextContract) {
    const complaint = await Complaint.find(params.id);

    if (!complaint) {
      return response.notFound({ message: 'Скаргу не знайдено.' });
    }

    return response.ok(complaint);
  }

  /**
   * @swagger
   * /api/complaints/{id}:
   *   put:
   *     summary: Оновлення скарги
   *     tags:
   *       - Complaints
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID скарги
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               context:
   *                 type: string
   *                 description: Новий зміст скарги
   *     responses:
   *       200:
   *         description: Скаргу оновлено успішно
   *       400:
   *         description: Не вдалося оновити скаргу
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const complaint = await Complaint.findOrFail(params.id);
      const data = request.only(['context']);
      complaint.merge(data);
      await complaint.save();
      return response.ok({ message: 'Complaint updated successfully', data: complaint });
    } catch (error) {
      return response.badRequest({ message: 'Failed to update complaint', error });
    }
  }

  /**
   * @swagger
   * /api/complaints/{id}:
   *   delete:
   *     summary: Видалення скарги
   *     tags:
   *       - Complaints
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID скарги
   *     responses:
   *       200:
   *         description: Скаргу видалено успішно
   *       400:
   *         description: Не вдалося видалити скаргу
   */
  public async delete({ params, response }: HttpContextContract) {
    try {
      const complaint = await Complaint.findOrFail(params.id);
      await complaint.delete();
      return response.ok({ message: 'Complaint deleted successfully' });
    } catch (error) {
      return response.badRequest({ message: 'Failed to delete complaint', error });
    }
  }
}
