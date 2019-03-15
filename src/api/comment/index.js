import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token, master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Comment, { schema } from './model'

const router = new Router()
const {user, photo, responseTo, content } = schema.tree

/**
 * @api {post} /comments Create comment
 * @apiName CreateComment
 * @apiGroup Comment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam photo Comment's photo.
 * @apiParam responseTo Comment's responseTo.
 * @apiParam content Comment's content.
 * @apiSuccess {Object} comment Comment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Comment not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ photo, responseTo, content }),
  create)

/**
 * @api {get} /comments Retrieve comments
 * @apiName RetrieveComments
 * @apiGroup Comment
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of comments.
 * @apiSuccess {Object[]} rows List of comments.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  index)

/**
 * @api {get} /comments/:id Retrieve comment
 * @apiName RetrieveComment
 * @apiGroup Comment
 * @apiSuccess {Object} comment Comment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Comment not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /comments/:id Update comment
 * @apiName UpdateComment
 * @apiGroup Comment
 * @apiParam photo Comment's photo.
 * @apiParam responseTo Comment's responseTo.
 * @apiParam content Comment's content.
 * @apiSuccess {Object} comment Comment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Comment not found.
 */
router.put('/:id',
  body({ user, photo, responseTo, content }),
  update)

/**
 * @api {delete} /comments/:id Delete comment
 * @apiName DeleteComment
 * @apiGroup Comment
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Comment not found.
 */
router.delete('/:id',
  destroy)

export default router
