import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question'
import CategoryInSet from 'App/Models/CategoryInSet';
import Set from 'App/Models/Set'
import Favourite from 'App/Models/Favorite';

//import PDFDocument from 'pdfkit'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import ExcelJS from 'exceljs'

import fs from 'fs'

import { Table, TableRow, TableCell } from 'docx';





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







/**
 * @swagger
 * /api/questions-export-word/{path}/{setId}:
 *   get:
 *     summary: Експортує сет питань у форматі Word
 *     description: Generates a Word document with questions, categories, and other information from the set.
 *     tags: [Sets]
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         description: ID сета, який потрібно експортувати.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успішне створення та завантаження документа Word.
 *         content:
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Невірне значення параметра `setId` або помилка доступу до сета.
 *       404:
 *         description: Сет не знайдений за вказаним `setId`.
 *       500:
 *         description: Помилка на сервері під час генерації документа.
 *     security:
 *       - bearerAuth: []
 */


  public async exportSetToWord({ params, auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
  
      // Отримання сету та пов'язаної інформації
      const set = await Set.query()
        .where('QuestionSet_id', params.setId)
        .preload('user')
        .preload('level')
        .preload('questions')
        .firstOrFail();
  
      const categories = await CategoryInSet.query()
        .where('questionSetId', set.QuestionSet_id)
        .preload('category')
        .exec();
  
      const isFavourite = await Favourite.query()
        .where('questionListId', set.QuestionSet_id)
        .andWhere('userId', user.userId)
        .first();
  
      // Формування документа
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun({ text: `Назва сету: ${set.name}`, bold: true, size: 28 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: `Рівень: ${set.level?.name || ''}`, size: 24 })],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Категорії: ${categories.map(cat => cat.category?.name).join(', ')}`,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: `Автор: ${set.user?.username || ''}`, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: `Доступ: ${set.access ? 'публічний' : 'приватний'}`, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: `Вподобаний: ${isFavourite ? 'Так' : 'Ні'}`, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: '\nПитання:', bold: true, size: 28 })],
              }),
  
              // Створення таблиці з питаннями
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph('ID Питання')] }),
                      new TableCell({ children: [new Paragraph('Статус')] }),
                      new TableCell({ children: [new Paragraph('Питання')] }),
                      new TableCell({ children: [new Paragraph('Відповідь')] }),
                      new TableCell({ children: [new Paragraph('Дата створення')] }),
                    ],
                  }),
                  // Додавання даних про питання
                  ...set.questions.map(question =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(question.questionId.toString())] }),
                        new TableCell({ children: [new Paragraph(question.status ? 'Вже знаю' : 'Ще вивчається')] }),
                        new TableCell({ children: [new Paragraph(question.content)] }),
                        new TableCell({ children: [new Paragraph(question.answer || '')] }),
                        new TableCell({
                          children: [
                            new Paragraph(new Date(question.createdAt.toJSDate()).toLocaleString()),
                          ],
                        }),
                        
                      ],
                    })
                  ),
                ],
              }),
            ],
          },
        ],
      });
  
      // Збереження документа
      // Генерація файлу Word
      /*const buffer = await Packer.toBuffer(doc)
      const filePath = 'D:' // Збереження на диск C

      // Запис файлу на диск
      fs.writeFileSync(filePath, buffer)

      // Відправка документа для завантаження
      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      response.header('Content-Disposition', 'attachment; filename=questions-export.docx')*/


      const directoryPath = params.path;
    const fileName = `/questions-export-${Date.now()}.docx`; // Унікальне ім'я файлу
    const filePath = directoryPath+fileName;

    // Перевірка чи існує директорія
    if (!fs.existsSync(directoryPath)) {
      // Якщо директорія не існує, створюємо її
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Генерація файлу Word
    const buffer = await Packer.toBuffer(doc);

    // Запис файлу на диск
    fs.writeFileSync(filePath, buffer);

    // Відправка документа для завантаження
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    response.header('Content-Disposition', `attachment; filename=${fileName}`);

    return response.stream(fs.createReadStream(filePath));
    } catch (error) {
      return response.status(500).json({ message: 'Не вдалося експортувати сет', error: error.message || error });
    }
  }








  public async exportToExcel({ response }: HttpContextContract) {
    try {
      // Отримання всіх питань з бази даних
      const questions = await Question.query()

      // Створення нового робочого листа Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Questions')

      // Додавання заголовків до стовпців
      worksheet.columns = [
        { header: 'ID Питання', key: 'questionId', width: 15 },
        { header: 'Статус', key: 'status', width: 10 },
        { header: 'Вміст', key: 'content', width: 50 },
        { header: 'Відповідь', key: 'answer', width: 50 },
      ]

      // Додавання даних з бази в Excel
      questions.forEach((question) => {
        worksheet.addRow({
          questionId: question.questionId,
          status: question.status ? 'Активний' : 'Неактивний',
          content: question.content,
          answer: question.answer,
        })
      })

      // Збереження файлу Excel на диск C
      const filePath = 'D:/questions-export.xlsx'

      // Запис файлу на диск
      await workbook.xlsx.writeFile(filePath)

      // Відправка документа для завантаження
      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      response.header('Content-Disposition', 'attachment; filename=questions-export.xlsx')

      return response.stream(fs.createReadStream(filePath))
    } catch (error) {
      console.error('Error generating Excel document:', error)
      return response.status(500).json({ message: 'Error generating Excel document', error })
    }
  }
}
