import { Thread } from '.'

let thread

beforeEach(async () => {
  thread = await Thread.create({ category: 'test', comments: 'test', headerComment: 'test', title: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = thread.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(thread.id)
    expect(view.category).toBe(thread.category)
    expect(view.comments).toBe(thread.comments)
    expect(view.headerComment).toBe(thread.headerComment)
    expect(view.title).toBe(thread.title)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = thread.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(thread.id)
    expect(view.category).toBe(thread.category)
    expect(view.comments).toBe(thread.comments)
    expect(view.headerComment).toBe(thread.headerComment)
    expect(view.title).toBe(thread.title)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
