import Koa from 'koa'
import Json from 'koa-json'
import Logger from 'koa-logger'
import Router from 'koa-rest-router'

const koa = new Koa()

koa.use(Logger())
koa.use(Json({ pretty: false, param: 'pretty', spaces: 2 }))


const api17 = Router({ prefix: '/api/v17' })

api17.resource('events', {
  index: async (ctx) => {
      ctx.body = { name: 'CAT', date: '2017-07-01', a: [1,2,3] }
  }
})

koa.use(api17.middleware())
console.log('Listening on port 3000')
koa.listen(3000);
