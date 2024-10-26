import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, rules, validator} from '@ioc:Adonis/Core/Validator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import User from 'App/Models/User'

export default class AuthController {

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
      return response.json({status:200, message:"Loged is successfully!", token:token})
    } catch (error) {
      return response.unauthorized("Invalid credentials"+error)
    }
  }



  public async register({request, response}:HttpContextContract){
    const payload = await request.validate(RegisterValidator)
    try {
      await User.create(payload)
      return response.status(200).json({
        message:"Account created successfully"
      })
    } catch (error) {
      return response.status(500).json({message:"Something went wrong!"+error}, )
    }
  }


  public async getUser({response, auth}:HttpContextContract){
    const user = auth.use("api").user;
    return response.json({status: 200, user});
  }


  public async logout({response, auth}:HttpContextContract){
    await auth.use("api").logout()
    return response.json({message:"Logged out successfuly!"})
  }

}


