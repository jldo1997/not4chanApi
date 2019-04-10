import { success, notFound } from '../../services/response/'
import { Thread } from '.'
import { Photo } from '../photo/index'
import { Comment } from '../comment/index'

const uploadService = require('../../services/upload/')

export const create = ({ bodymen: { body } }, res, next) =>
  Thread.create(body)
    .then((thread) => thread.view(true))
    .then(success(res, 201))
    .catch(next)

export const create2 = async (req, res, next) => {
  var photo;
  var headerComment;
  var user = req.user;
  var content = req.body.content;
  var category = req.body.category;
  var title = req.body.title;
  await uploadService.uploadFromBinary(req.file.buffer)
  .then(json => Photo.create({
      url: json.data.link,
      deletehash: json.data.deletehash
    }))
    .then((phot) => photo = phot.id)
    .catch(next)
  
  await Comment.create({ content, user, photo })
  .then((coment) => headerComment = coment.id)
        .catch(next)

  await Thread.create({ category, headerComment, title })
  .then((thread) => thread.view(true))
  .then(res.send(201))
  .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Thread.count(query)
    .then(count => Thread.find(query, select, cursor)
    .populate({path:'headerComment', populate: [{path: 'user' }, {path: 'photo'}]})
    .populate({path:'comments', populate: [{path: 'user' }, {path: 'photo'}]})
    .populate('category')
      .then((threads) => ({
        count,
        rows: threads.map((thread) => thread.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Thread.findById(params.id)
    .populate({path:'headerComment', populate: [{path: 'user' }, {path: 'photo'}]})
    .populate({path:'comments', populate: [{path: 'user' }, {path: 'photo'}]})
    .populate('category')
    .then(notFound(res))
    .then((thread) => thread ? thread.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Thread.findById(params.id)
    .populate({path:'headerComment', populate: [{path: 'user' }, {path: 'photo'}]})
    .populate({path:'comments', populate: [{path: 'user' }, {path: 'photo'}]})
    .populate('category')
    .then(notFound(res))
    .then((thread) => thread ? Object.assign(thread, body).save() : null)
    .then((thread) => thread ? thread.view(true) : null)
    .then(success(res))
    .catch(next)


export const destroy = ({ params }, res, next) =>
  Thread.findById(params.id)
    .then(notFound(res))
    .then((thread) => thread ? thread.remove() : null)
    .then(success(res, 204))
    .catch(next)
