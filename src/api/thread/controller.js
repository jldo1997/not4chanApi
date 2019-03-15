import { success, notFound } from '../../services/response/'
import { Thread } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Thread.create(body)
    .then((thread) => thread.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Thread.count(query)
    .then(count => Thread.find(query, select, cursor)
    .populate({path:'headerComment', populate: [{path: 'user' }, {path: 'photo'}]})
    .populate('comments')
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
    .populate('headerComment')
    .populate('comments')
    .populate('category')
    .then(notFound(res))
    .then((thread) => thread ? thread.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Thread.findById(params.id)
    .populate('headerComment')
    .populate('comments')
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
