import mongoose, { Schema } from 'mongoose'

const commentSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  photo: {
    type: Schema.ObjectId,
    ref: 'Photo'
  },
  responseTo: {
    type: Schema.ObjectId,
    ref: 'comment',
    required: false
  },
  content: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

commentSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      photo: this.photo,
      responseTo: this.responseTo,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }


    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Comment', commentSchema)

export const schema = model.schema
export default model
