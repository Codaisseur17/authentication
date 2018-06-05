import {
  JsonController,
  BadRequestError,
  Authorized,
  CurrentUser,
  Get,
  HttpCode,
  Post,
  Body
} from 'routing-controllers'
import * as request from 'superagent'

const responsesUrl = process.env.RESPONSES_URL || 'http://responses:4002'

@JsonController()
export default class ResponseController {
  @Authorized()
  @Get('/responses')
  async getResponses(@CurrentUser() userId: { id }) {
    const result = await request
      .get(`${responsesUrl}/responses`)
      .set('userId', userId.id)
      .catch(error => console.log(error))

    if (!result) throw new BadRequestError('Invalid permissions')

    return result
  }

  @Post('/responses')
  @HttpCode(201)
  async createResponse(@Body() body: object) {
    const result = await request
      .post(`${responsesUrl}/responses`)
      .send(body)
      .catch(error => console.log(error))

    if (!result) throw new BadRequestError('Something went wrong')

    return result
  }
}
