import 'reflect-metadata'
import { createKoaServer, BadRequestError, Action } from 'routing-controllers'
import { verify } from './jwt'
import LoginController from './logins'
import QuizzesController from './quizzes'
import ResponseController from './responses'

const port = process.env.PORT || 4000

const app = createKoaServer({
  cors: true,
  controllers: [LoginController, QuizzesController, ResponseController],
  authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const [, token] = header.split(' ')

      try {
        return !!(token && verify(token))
      } catch (e) {
        throw new BadRequestError(e)
      }
    }

    return false
  },
  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const [, token] = header.split(' ')

      if (token) {
        const { id } = verify(token)
        return id
      }
    }
    return undefined
  }
})

app.listen(port, () => {
  return console.log(`Listening on port ${port}`)
})
