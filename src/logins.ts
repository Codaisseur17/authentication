import { IsString } from 'class-validator'
import {
  JsonController,
  Post,
  Body,
  BadRequestError
} from 'routing-controllers'
import { sign } from './jwt'
import * as request from 'superagent'

const usersUrl = process.env.USERS_URL || 'http://users:4003'

class AuthenticatePayload {
  @IsString() email: string

  @IsString() password: string
}

@JsonController()
export default class LoginController {
  @Post('/logins')
  async authenticate(@Body() { email, password }: AuthenticatePayload) {
    const response = await request
      .post(`${usersUrl}/logins`)
      .send({ email, password })
      .catch(error => console.log(error))

    if (!response) throw new BadRequestError('User does not exist')

    const { id } = response.body

    const jwt = sign({ id: id })
    return { jwt }
  }
}
