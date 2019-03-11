import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token, master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Thread, { schema } from './model'

const router = new Router()
const { category, comments, headerComment, title } = schema.tree

/**
 * @api {post} /threads Create thread
 * @apiName CreateThread
 * @apiGroup Thread
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam category Thread's category.
 * @apiParam comments Thread's comments.
 * @apiParam headerComment Thread's headerComment.
 * @apiParam title Thread's title.
 * @apiSuccess {Object} thread Thread's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Thread not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ category, comments, headerComment, title }),
  create)

/**
 * @api {get} /threads Retrieve threads
 * @apiName RetrieveThreads
 * @apiGroup Thread
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of threads.
 * @apiSuccess {Object[]} rows List of threads.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  index)

/**
 * @api {get} /threads/:id Retrieve thread
 * @apiName RetrieveThread
 * @apiGroup Thread
 * @apiSuccess {Object} thread Thread's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Thread not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /threads/:id Update thread
 * @apiName UpdateThread
 * @apiGroup Thread
 * @apiParam category Thread's category.
 * @apiParam comments Thread's comments.
 * @apiParam headerComment Thread's headerComment.
 * @apiParam title Thread's title.
 * @apiSuccess {Object} thread Thread's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Thread not found.
 */
router.put('/:id',
  body({ category, comments, headerComment, title }),
  update)

/**
 * @api {delete} /threads/:id Delete thread
 * @apiName DeleteThread
 * @apiGroup Thread
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Thread not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
