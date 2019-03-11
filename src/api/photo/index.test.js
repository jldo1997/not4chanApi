import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Photo } from '.'

const app = () => express(apiRoot, routes)

let userSession, photo

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  userSession = signSync(user.id)
  photo = await Photo.create({})
})

test('POST /photos 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, url: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.url).toEqual('test')
})

test('POST /photos 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /photos 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /photos 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /photos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${photo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(photo.id)
})

test('GET /photos/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${photo.id}`)
  expect(status).toBe(401)
})

test('GET /photos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /photos/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${photo.id}`)
    .send({ url: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(photo.id)
  expect(body.url).toEqual('test')
})

test('PUT /photos/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ url: 'test' })
  expect(status).toBe(404)
})

test('DELETE /photos/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${photo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /photos/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${photo.id}`)
  expect(status).toBe(401)
})

test('DELETE /photos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})
