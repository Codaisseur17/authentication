import * as Koa from 'koa'
import * as request from 'request'
import * as Router from 'koa-router'
import * as jwt from 'koa-jwt'
import { secret } from './jwt'
import { sign } from 'jsonwebtoken'
import * as superRequest from 'superagent'
import * as bodyParser from 'koa-bodyparser'

const app = new Koa()
const routes = new Router()

const quizzesUrl = process.env.QUIZZES_URL || 'http://quizzes:4001'
const responsesUrl = process.env.RESPONSES_URL || 'http://responses:4002'
const usersUrl = process.env.USERS_URL || 'http://users:4003'
const webhooksUrl = process.env.WEBHOOKS_URL || 'http://webhooks:4004'

const port = process.env.PORT || 4000

const setHeaders = async (ctx: Koa.Context, next: () => Promise<any>) => {
  if (ctx.state.user) {
    ctx.request.header = {
      'X-User-id': ctx.state.user.id,
      'X-User-isTeacher': ctx.state.user.isTeacher
    }
  }

  await next()
}

const allQuizzes = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${quizzesUrl}${ctx.path}${ctx.querystring}`
  console.log(`Proxying to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
}

const allResponses = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${responsesUrl}${ctx.path}${ctx.querystring}`
  console.log(`Proxying to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
}

const allUsers = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${usersUrl}${ctx.path}${ctx.querystring}`
  console.log(`Proxying to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
}

const allWebhooks = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const uri = `${webhooksUrl}${ctx.path}${ctx.querystring}`
  console.log(`Proxying to ${uri}`)
  ctx.body = ctx.req.pipe(request(uri))
  await next()
}

routes.post(
  '/logins',
  bodyParser(),
  async (ctx: Koa.Context, next: () => Promise<any>) => {
    const uri = `${usersUrl}${ctx.path}`
    console.log(`Proxying to ${uri}`)

    const { email, password } = ctx.request.body

    const response = await superRequest.post(uri).send({ email, password })

    const user = {
      id: response.body.loginUser.id,
      isTeacher: response.body.loginUser.isTeacher
    }

    const jwt = sign(user, secret, { expiresIn: '4h' })

    ctx.body = { jwt }

    await next()
  }
)

routes
  .all(
    /^\/quizzes(\/.*)?/,
    jwt({ secret: secret, passthrough: true }),
    setHeaders,
    allQuizzes
  )
  .all(
    /^\/responses(\/.*)?/,
    jwt({ secret: secret, passthrough: true }),
    setHeaders,
    allResponses
  )
  .all(
    /^\/users(\/.*)?/,
    jwt({ secret: secret, passthrough: true }),
    setHeaders,
    allUsers
  )
  .all(
    /^\/webhooks(\/.*)?/,
    jwt({ secret: secret, passthrough: true }),
    setHeaders,
    allWebhooks
  )

app
  .use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = { message: err.message }
      ctx.app.emit('error', err, ctx)
    }
  })
  .use(routes.routes())
  .use(routes.allowedMethods())
app.listen(port, () => {
  return console.log(`Listening on port ${port}`)
})
