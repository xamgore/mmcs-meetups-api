import Router from 'koa-rest-router'
import db from '../database'
import _ from 'lodash'

const api = Router({ prefix: '/api/v17' })

api.resource('events', {

  show: async ctx =>
    ctx.body = await db.get('events').find({ link: ctx.params.event }).value(),


  index: async ctx => {
    ctx.body = await db.get('events').value()
  },


  create: async ctx => {
    let count = await db.get('events').find({ link: ctx.request.body.link }).size().value()
    if (count > 0) return ctx.throw(400, 'event with such link already exists')

    let fields = _.pick(ctx.request.body, [
      'link', 'theme', 'title', 'date', 'time', 'place', 'annotation', 'text', 'authors', 'attendees' ])

    // TODO: generate link by title
    // TODO: validate fields

    db.get('events').push(fields).write()
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
