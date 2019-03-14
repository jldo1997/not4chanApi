import mongoose, { Schema } from 'mongoose'

const photoSchema = new Schema({
  url: {
    type: String
  },
  deletehash: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

photoSchema.pre('remove', {query: true }, function(next){
  console.log('Elminando la imagen' + this.url)
  uploadService.deleteImage(this.deletehash)
  return next();
})

photoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      url: this.url,
      deletehash: this.deletehash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Photo', photoSchema)

export const schema = model.schema
export default model
