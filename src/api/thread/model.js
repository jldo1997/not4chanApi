import mongoose, { Schema } from 'mongoose'
import { Comment } from '../comment/index'

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

threadSchema.pre('remove', function(next){
  Comment.remove({ thread: this._id}).exec();
  next();
});

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
