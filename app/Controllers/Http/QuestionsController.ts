import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question'


//import PDFDocument from 'pdfkit'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import ExcelJS from 'exceljs'

import fs from 'fs'

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






  /*public async export({ response, request }: HttpContextContract) {
    const format = request.input('format') // Очікуємо значення 'pdf', 'word' або 'excel'
    
    // Отримання всіх запитань
    const questions = await Question.query()

    if (format === 'pdf') {
      // Експорт у PDF
      const doc = new PDFDocument()
      response.header('Content-Disposition', 'attachment; filename=questions.pdf')
      response.type('application/pdf')
      
      doc.pipe(response)
      doc.fontSize(18).text('Questions List', { align: 'center' })
      
      questions.forEach((question) => {
        doc
          .moveDown()
          .fontSize(12)
          .text(`Question ID: ${question.questionId}`)
          .text(`Content: ${question.content}`)
          .text(`Answer: ${question.answer}`)
          .text(`Status: ${question.status ? 'Active' : 'Inactive'}`)
          .text(`Created At: ${question.createdAt.toFormat('yyyy-MM-dd HH:mm')}`)
      })
      
      doc.end()
      
    } else if (format === 'word') {
      // Експорт у Word
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Questions List', bold: true, size: 32 }),
              ],
              alignment: 'center',
            }),
            ...questions.map((question) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `Question ID: ${question.questionId}\n`, bold: true }),
                  new TextRun(`Content: ${question.content}\nAnswer: ${question.answer}\nStatus: ${question.status ? 'Active' : 'Inactive'}\nCreated At: ${question.createdAt.toFormat('yyyy-MM-dd HH:mm')}\n`),
                ],
              })
            ),
          ],
        }],
      })
      
      const buffer = await Packer.toBuffer(doc)
      response.header('Content-Disposition', 'attachment; filename=questions.docx')
      response.type('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      response.send(buffer)
      
    } else if (format === 'excel') {
      // Експорт у Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Questions')
      
      worksheet.columns = [
        { header: 'Question ID', key: 'questionId', width: 15 },
        { header: 'Content', key: 'content', width: 50 },
        { header: 'Answer', key: 'answer', width: 50 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Created At', key: 'createdAt', width: 20 },
      ]
      
      questions.forEach((question) => {
        worksheet.addRow({
          questionId: question.questionId,
          content: question.content,
          answer: question.answer,
          status: question.status ? 'Active' : 'Inactive',
          createdAt: question.createdAt.toFormat('yyyy-MM-dd HH:mm'),
        })
      })
      
      response.header('Content-Disposition', 'attachment; filename=questions.xlsx')
      response.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      
      await workbook.xlsx.write(response.response)
    } else {
      return response.status(400).json({ message: 'Invalid format specified' })
    }
  }*/



  public async export({ response }: HttpContextContract) {
    try {
      // Отримання всіх питань з бази даних
      const questions = await Question.query()

      // Створення документа Word
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: questions.map((question) => {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: `ID Питання: ${question.questionId}`,
                    bold: true,
                  }),
                  new TextRun({
                    text: `\nСтатус: ${question.status ? 'Активний' : 'Неактивний'}`,
                  }),
                  new TextRun({
                    text: `\nВміст: ${question.content}`,
                  }),
                  new TextRun({
                    text: `\nВідповідь: ${question.answer}\n\n`,
                  }),
                ],
              })
            }),
          },
        ],
      })

      // Генерація файлу Word
      const buffer = await Packer.toBuffer(doc)
      const filePath = 'D:/questions-export.docx' // Збереження на диск C

      // Запис файлу на диск
      fs.writeFileSync(filePath, buffer)

      // Відправка документа для завантаження
      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      response.header('Content-Disposition', 'attachment; filename=questions-export.docx')

      return response.stream(fs.createReadStream(filePath))
    } catch (error) {
      console.error('Error generating Word document:', error)
      return response.status(500).json({ message: 'Error generating Word document', error })
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
