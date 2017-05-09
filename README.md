### Server internals

The project is based on the [`koa`](http://koajs.com/) framework.
The main advantage is that you can use `async / await` operators
to handle promise-based operations (IO, network, etc).

The heart of the project is in the `app.js` file:

```js
const koa = new Koa()

koa.use(…)        // use some helpful stuff
koa.use(Json(…))  // i.e. prettify output json

// here is a business logic
import api17 from './api/v17'

// use api, run the server
koa.use(api17.middleware())
koa.listen(3001)
```

#### About REST

So what the `v17.js` file is about?
It build routes according to REST API standards.

REST has a notion of _resource_ — it's an object,
that can be created, edited, updated, but using HTTP requests.

If user visits URL `/events` he (she) gets _all_ events.
`/event/7` returns the object with id 7.
But each of these requests was just a GET request.

When user sends a POST request to `/events` with some information,
he (she) can create a _new_ event. It's like a message "hay, server, post a new event to events, please, ok?". The other way is to send GET to `/events/new` address.

 `PUT` request can _update_ value.
 `DELETE` method obviously _removes_ the object.
 The full table can be found here:
 [mapping](https://github.com/alexmingoia/koa-resource-router#action-mapping).

#### Routing

To simplify our life we use `koa-rest-router` middleware (plugin).
It defines resources, and mapping with some logic.

```js
const api = Router({ prefix: '/api/v17' })

api.resource('events', {
  index: async ctx => …,      // to get them all, /events

  show: async ctx => …,       // just one of them, /events/7

  create: async ctx => { … }, // create new, POST /events

  update: async ctx => { … }  // update existing, PUT /events/7
})
```

### Build process

This server is self-sustained, it doesn't depend on the `mmcs-meetups` project.
You can use `curl` to test it manually. Later normal test suits will be added.

```shell
$ yarn
$ yarn start
```

The nodemon tool (node demon, a background process) will be started.
It will watch onto changes in each file except `db.json`.


### Examples of using `curl`

It is possible to send common get requests:

```shell
$ curl -X GET http://localhost:3001/api/v17/events/

[{"theme":"orange","link":"detecting-people-in-video","title":"Детектирование и трекинг людей на видеоряде","date":"2017-03-20","time":"17:30","annotation":"\…
```

If you want to prettify output, use `?pretty` parameter.

```shell
$ curl -X GET http://localhost:3001/api/v17/events/47hours?pretty

{
  "link": "47hours",
  "theme": "violet",
  "title": "VR & AR хакатон",
  "date": "2017-04-02",
  "time": "16:30",
  "place": "311",
  "annotation": "Это супер крутой хакатон на 47 часов.<br>Но есть один минус: он в Таганроге."
}
```

The `-X` flag (e*x*cecute) can be replaced with `--request`.
The meaning is still the same: send a custom request.

Another one flag is `--data` or `-d` is used to send custom data.
When combined with `--header` or `-H`, it is even possible to send
json-formatted data:

```shell
$ curl -X POST -H "Content-Type: application/json" -d '{"link": "cat", "name": "Category Theory"}' http://localhost:3001/api/v17/events

{"link": "cat", "name": "Category Theory"}
```

For windows you can use another form:

```shell
$ echo '{"example" : 3}' |  sed "s/'\(.*\)'/\1/" | curl -d @- http://127.0.0.1:3001/api/v17/events -X POST -H "Content-Type: application/json"
```
