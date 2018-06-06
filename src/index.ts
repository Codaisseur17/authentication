// import 'reflect-metadata'
// import { createKoaServer, BadRequestError, Action } from 'routing-controllers'
// import { verify } from './jwt'
// import LoginController from './logins'
// import QuizzesController from './quizzes'
// import ResponseController from './responses'

// const port = process.env.PORT || 4000

// const app = createKoaServer({
//   cors: true,
//   controllers: [LoginController, QuizzesController, ResponseController],
//   authorizationChecker: (action: Action) => {
//     const header: string = action.request.headers.authorization
//     if (header && header.startsWith('Bearer ')) {
//       const [, token] = header.split(' ')

//       try {
//         return !!(token && verify(token))
//       } catch (e) {
//         throw new BadRequestError(e)
//       }
//     }

//     return false
//   },
//   currentUserChecker: async (action: Action) => {
//     const header: string = action.request.headers.authorization
//     if (header && header.startsWith('Bearer ')) {
//       const [, token] = header.split(' ')

//       if (token) {
//         const { id } = verify(token)
//         return id
//       }
//     }
//     return undefined
//   }
// })

// app.listen(port, () => {
//   return console.log(`Listening on port ${port}`)
// })

import * as Koa from 'koa'
import * as request from 'request'
import * as Router from 'koa-router'
import * as jwt from 'koa-jwt'
import { secret, sign } from './jwt'

const app = new Koa()
const routes = new Router()

const quizzesUrl = process.env.QUIZZES_URL || 'http://quizzes:4001'
const responsesUrl = process.env.RESPONSES_URL || 'http://responses:4002'
const usersUrl = process.env.USERS_URL || 'http://users:4003'
const webhooksUrl = process.env.WEBHOOKS_URL || 'http://webhooks:4004'

const port = process.env.PORT || 4000

const setHeaders = (ctx: Koa.Context, next: () => Promise<any>) => {
  //REMOVE ALL HEADERS
  ctx.headers.remove()
  // SET USER HEADERS
  if (ctx.state.user) {
    console.log(ctx.state.user)
    ctx.set('X-User', ctx.state.user)
    return next()
  }

  return next()
}

const allQuizzes = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${quizzesUrl}${ctx.path}${ctx.querystring}`
  console.log(`Proxying ${ctx} to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
}

const allResponses = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${responsesUrl}${ctx.path}${ctx.querystring}`
  console.log(`Proxying ${ctx} to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
}

const allUsers = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${usersUrl}${ctx.path}${ctx.querystring}`
  console.log(`Proxying ${ctx} to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
}

const allWebhooks = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${webhooksUrl}${ctx.path}${ctx.querystring}`
  console.log(`Proxying ${ctx} to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
}

routes.post('/logins', async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${usersUrl}${ctx.path}`
  console.log(`Proxying ${ctx} to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
  // DO SOMETHING WITH REQUEST RESPONSE
  ctx.body = sign(ctx.body)
})

routes.all(
  /^\/quizzes(\/.*)?/,
  jwt({ secret: secret, passthrough: true }),
  setHeaders,
  allQuizzes
)
routes.all(
  /^\/responses(\/.*)?/,
  jwt({ secret: secret, passthrough: true }),
  setHeaders,
  allResponses
)
routes.all(
  /^\/users(\/.*)?/,
  jwt({ secret: secret, passthrough: true }),
  setHeaders,
  allUsers
)
routes.all(
  /^\/webhooks(\/.*)?/,
  jwt({ secret: secret, passthrough: true }),
  setHeaders,
  allWebhooks
)

app.use(routes.routes()).use(routes.allowedMethods())
app.listen(port, () => {
  return console.log(`Listening on port ${port}`)
})
