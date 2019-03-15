import mongoose, { Schema } from 'mongoose'

const threadSchema = new Schema({
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment'
  }],
  headerComment: {
    type: Schema.ObjectId,
    ref: 'Comment',
    required: true
  },
  title: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

threadSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      category: this.category,
      comments: this.comments.view(full),
      headerComment: this.headerComment.view(full),
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Thread', threadSchema)

export const schema = model.schema
export default model
