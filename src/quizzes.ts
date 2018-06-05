import { JsonController, Get, Post, Delete, CurrentUser, Body, Param, Authorized } from "routing-controllers"
import * as request from "superagent"

const quizzesUrl = process.env.QUIZZES_URL

@JsonController()
export default class QuizzesController {
  
  @Get("/quizzes/")
  async allQuizzes() {
    const quizzes = await request.get(`${quizzesUrl}`)
    return quizzes
  }

  @Authorized()
  @Post("/quizzes/")
  async postQuizzes(
    @CurrentUser() user: {id},
    @Body() body: object 
) {
    const result = await request
      .post(`${quizzesUrl}/quizzes`)
      .send(body)

    return result.body
  }

  @Authorized()
  @Delete("/quizzes/{:id}")
  async deleteQuiz(
    @Param('id') id: number
  ) {
    const result = await request
    .delete(`${quizzesUrl}/${id}`)

    return result.body
  }
}