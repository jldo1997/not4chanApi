import { success, notFound } from '../../services/response/'
import { Comment } from '.'
import { Photo } from '../photo/index'

const uploadService = require('../../services/upload/')

export const create = ({ user, bodymen: { body } }, res, next) =>
  Comment.create({ ...body, user })
    .then((comment) => comment.view(true))
    .then(success(res, 201))
    .catch(next)

export const createAlexCorasonsito = (req, res, next) =>{
  uploadService.uploadFromBinary(req.file.buffer)
      .then(json => Photo.create({
            url: json.data.link,
            deletehash: json.data.deletehash
          }))
          .then((photo) => {
            Comment.create({ req , photo})
            .then((comment) => comment.view(true))
          })
          .then(success(res, 201))
          .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Comment.count(query)
    .then(count => Comment.find(query, select, cursor)
      .populate('user')
      .populate('photo')
      .populate({path: 'responseTo', populate: {path: 'user'}})
      .then((comments) => ({
        count,
        rows: comments.map((comment) => comment.view(true))
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Comment.findById(params.id)
    .populate('user')
    .populate('photo')
    .populate('responseTo')
    .then(notFound(res))
    .then((comment) => comment ? comment.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Comment.findById(params.id)
    .populate('user')
    .populate('photo')
    .populate('responseTo')
    .then(notFound(res))
    .then((comment) => comment ? Object.assign(comment, body).save() : null)
    .then((comment) => comment ? comment.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Comment.findById(params.id)
    .then(notFound(res))
    .then((comment) => comment ? comment.remove() : null)
    .then(success(res, 204))
    .catch(next)
