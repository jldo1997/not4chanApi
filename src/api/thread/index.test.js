import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Thread } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, thread

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  thread = await Thread.create({})
})

test('POST /threads 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, category: 'test', comments: 'test', headerComment: 'test', title: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.category).toEqual('test')
  expect(body.comments).toEqual('test')
  expect(body.headerComment).toEqual('test')
  expect(body.title).toEqual('test')
})

test('POST /threads 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /threads 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /threads 401 (admin)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('GET /threads 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /threads 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /threads/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${thread.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(thread.id)
})

test('GET /threads/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /threads/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${thread.id}`)
    .send({ category: 'test', comments: 'test', headerComment: 'test', title: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(thread.id)
  expect(body.category).toEqual('test')
  expect(body.comments).toEqual('test')
  expect(body.headerComment).toEqual('test')
  expect(body.title).toEqual('test')
})

test('PUT /threads/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ category: 'test', comments: 'test', headerComment: 'test', title: 'test' })
  expect(status).toBe(404)
})

test('DELETE /threads/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${thread.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /threads/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${thread.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /threads/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${thread.id}`)
  expect(status).toBe(401)
})

test('DELETE /threads/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
