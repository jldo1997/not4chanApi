import { Comment } from '.'
import { User } from '../user'

let user, comment

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  comment = await Comment.create({ user, thread: 'test', photo: 'test', responseTo: 'test', content: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = comment.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comment.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.thread).toBe(comment.thread)
    expect(view.photo).toBe(comment.photo)
    expect(view.responseTo).toBe(comment.responseTo)
    expect(view.content).toBe(comment.content)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = comment.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comment.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.thread).toBe(comment.thread)
    expect(view.photo).toBe(comment.photo)
    expect(view.responseTo).toBe(comment.responseTo)
    expect(view.content).toBe(comment.content)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
