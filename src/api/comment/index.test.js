import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Comment } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, comment

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  comment = await Comment.create({ user })
})

test('POST /comments 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, thread: 'test', photo: 'test', responseTo: 'test', content: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.thread).toEqual('test')
  expect(body.photo).toEqual('test')
  expect(body.responseTo).toEqual('test')
  expect(body.content).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /comments 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /comments 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /comments 401 (admin)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('GET /comments 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /comments 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /comments/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${comment.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(comment.id)
})

test('GET /comments/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /comments/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${comment.id}`)
    .send({ thread: 'test', photo: 'test', responseTo: 'test', content: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(comment.id)
  expect(body.thread).toEqual('test')
  expect(body.photo).toEqual('test')
  expect(body.responseTo).toEqual('test')
  expect(body.content).toEqual('test')
})

test('PUT /comments/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ thread: 'test', photo: 'test', responseTo: 'test', content: 'test' })
  expect(status).toBe(404)
})

test('DELETE /comments/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${comment.id}`)
  expect(status).toBe(204)
})

test('DELETE /comments/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
