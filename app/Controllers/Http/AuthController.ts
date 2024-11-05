import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, rules, validator} from '@ioc:Adonis/Core/Validator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import User from 'App/Models/User'
import DateOfVisit from 'App/Models/DateOfVisit'
import { DateTime } from 'luxon'
import Set from 'App/Models/Set'
import Level from 'App/Models/Level'



export default class AuthController {

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: User login
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: Successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: "Logged in successfully!"
   *                 token:
   *                   type: string
   *                   example: "Bearer your.jwt.token"
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Something went wrong
   */

  public async login({request, response, auth}:HttpContextContract){
    const payload = await request.validate({
        schema:schema.create({
          email:schema.string([rules.email()]),
          password:schema.string()
      }),
      reporter: validator.reporters.vanilla,
    })

    try {
      const token = await auth.use("api").attempt(payload.email, payload.password)

      const userId = auth.use("api").user?.userId // Отримуємо ID користувача
      if (userId) {
        await DateOfVisit.create({
          userId: userId,
          date: DateTime.local(),
        })
      }

      return response.json({status:200, message:"Loged is successfully!", token:token})
    } catch (error) {
      return response.unauthorized("Invalid credentials"+error)
    }
  }


  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: User registration
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: John
   *               username:
   *                 type: string
   *                 example: johndoe
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *               password_confirmation:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: Account created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Account created successfully"
   *       500:
   *         description: Something went wrong
   */
  private async getFirstLevelId(): Promise<number | null> {
    const level = await Level.query().orderBy('levelId', 'asc').first()
    return level ? level.levelId : null
  }
  public async register({request, response}:HttpContextContract){
    const payload = await request.validate(RegisterValidator)
    try {
      const user = await User.create({
        ...payload,
        surname: 'default'
      })
      const firstLevelId = await this.getFirstLevelId()

      // Create default set for the user
      await Set.create({
        userId: user.userId,
        name: 'Default Set',
        access: true,
        data: DateTime.local(),
        levelId: firstLevelId,  // Set a default level if applicable
        shared: false
      })

      return response.status(200).json({
        message:"Account created successfully"
      })
    } catch (error) {
      return response.status(500).json({message:"Something went wrong!"+error}, )
    }
  }


  /**
   * @swagger
   * /api/user:
   *   get:
   *     summary: Get user information
   *     tags: [Authentication]
   *     responses:
   *       200:
   *         description: User information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                 user:
   *                   type: object
   *                   properties:
   *                     userId:
   *                       type: integer
   *                     name:
   *                       type: string
   *                     surname:
   *                       type: string
   *                     username:
   *                       type: string
   *                     email:
   *                       type: string
   *                     
   *       401:
   *         description: Unauthorized access
   */
  public async getUser({response, auth}:HttpContextContract){
    const user = auth.use("api").user;
    return response.json({status: 200, user});
  }

  /**
   * @swagger
   * /api/logout:
   *   post:
   *     summary: User logout
   *     tags: [Authentication]
   *     responses:
   *       200:
   *         description: Logged out successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Logged out successfully!"
   */
  public async logout({response, auth}:HttpContextContract){
    await auth.use("api").logout()
    return response.json({message:"Logged out successfuly!"})
  }

}


