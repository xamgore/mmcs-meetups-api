import Router from 'koa-rest-router'
import db from '../database'
import tm from '../telegram'
import _ from 'lodash'

const api = Router({ prefix: '/api/v17' })

api.resource('events', {

  show: async ctx =>
    ctx.body = await db.get('events').find({ link: ctx.params.event }).value(),


  index: async ctx => {
    ctx.body = await db.get('events').value()
  },


  create: async ctx => {
    let { event, pass } = ctx.request.body
    if (pass !== process.env.MMCS_API_PASSWORD) return ctx.throw(401, 'wrong password')

    let count = await db.get('events').find({ link: event.link }).size().value()
    if (count > 0) return ctx.throw(400, 'event with such link already exists')

    let fields = _.pick(event, [
      'link', 'theme', 'title', 'date', 'time', 'place', 'annotation', 'text', 'authors', 'attendees' ])

    // TODO: generate link by title
    // TODO: validate fields

    db.get('events').push(fields).write()

    let msg = `*${fields.title}*\n${fields.annotation} [Подробнее](https://meetups.sfedu.ru/${fields.link})`
    tm.sendMessage(process.env.MMCS_TELEGRAM_CHANNEL, msg, { parse_mode: 'Markdown' })

    ctx.body = ''
  },


  update: async ctx => {
    let fields = _.pick(ctx.request.body, [
      'link', 'theme', 'title', 'date', 'time', 'place', 'annotation', 'text', 'authors', 'attendees' ])

    // TODO: generate link by title
    // TODO: validate fields

    let event = await db.get('events').find({ link: ctx.params.event })
    await event.assign(fields).write()
    ctx.body = await event.value()
  }

})


export default api
