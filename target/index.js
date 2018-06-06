"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const request = require("request");
const Router = require("koa-router");
const jwt = require("koa-jwt");
const jwt_1 = require("./jwt");
const bodyparser = require("koa-bodyparser");
const app = new Koa();
const routes = new Router();
const quizzesUrl = process.env.QUIZZES_URL || 'http://quizzes:4001';
const responsesUrl = process.env.RESPONSES_URL || 'http://responses:4002';
const usersUrl = process.env.USERS_URL || 'http://users:4003';
const webhooksUrl = process.env.WEBHOOKS_URL || 'http://webhooks:4004';
const port = process.env.PORT || 4000;
const setHeaders = (ctx, next) => {
    if (ctx.state.user) {
        console.log(ctx.state.user);
        ctx.set('X-User', ctx.state.user);
        return next();
    }
    return next();
};
const allQuizzes = async (ctx, next) => {
    const uri = `${quizzesUrl}${ctx.path}${ctx.querystring}`;
    console.log(`Proxying ${ctx} to ${uri}`);
    ctx.body = ctx.req.pipe(request(uri));
    await next();
};
const allResponses = async (ctx, next) => {
    const uri = `${responsesUrl}${ctx.path}${ctx.querystring}`;
    console.log(`Proxying ${ctx} to ${uri}`);
    ctx.body = ctx.req.pipe(request(uri));
    await next();
};
const allUsers = async (ctx, next) => {
    const uri = `${usersUrl}${ctx.path}${ctx.querystring}`;
    console.log(`Proxying ${ctx} to ${uri}`);
    ctx.body = ctx.req.pipe(request(uri));
    await next();
};
const allWebhooks = async (ctx, next) => {
    const uri = `${webhooksUrl}${ctx.path}${ctx.querystring}`;
    console.log(`Proxying ${ctx} to ${uri}`);
    ctx.body = ctx.req.pipe(request(uri));
    await next();
};
routes.post('/logins', async (ctx, next) => {
    const uri = `${usersUrl}${ctx.path}`;
    console.log(`Proxying ${ctx} to ${uri}`);
    ctx.body = ctx.req.pipe(request(uri));
    await next();
    console.log(ctx.body);
    ctx.body = jwt_1.sign(ctx.body);
});
routes.all(/^\/quizzes(\/.*)?/, jwt({ secret: jwt_1.secret, passthrough: true }), setHeaders, allQuizzes);
routes.all(/^\/responses(\/.*)?/, jwt({ secret: jwt_1.secret, passthrough: true }), setHeaders, allResponses);
routes.all(/^\/users(\/.*)?/, jwt({ secret: jwt_1.secret, passthrough: true }), setHeaders, allUsers);
routes.all(/^\/webhooks(\/.*)?/, jwt({ secret: jwt_1.secret, passthrough: true }), setHeaders, allWebhooks);
app.use(bodyparser());
app.use(routes.routes()).use(routes.allowedMethods());
app.listen(port, () => {
    return console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=index.js.map