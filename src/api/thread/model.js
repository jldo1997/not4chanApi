import mongoose, { Schema } from 'mongoose'

const threadSchema = new Schema({
  category: {
    type: Schema.ObjectId,
    ref: 'category'
  },
  comments: [{
    type: Schema.ObjectId,
    ref: 'comment'
  }],
  headerComment: {
    type: Schema.ObjectId,
    ref: 'comment',
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
      comments: this.comments,
      headerComment: this.headerComment,
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
