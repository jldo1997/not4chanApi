
const imgur = require('imgur')
imgur.setClientId('8d306b505ae12bd')

export function uploadFromBinary (binary) {
  let base64 = Buffer.from(binary).toString('base64')
  return imgur.uploadBase64(base64)
}

export function deleteImage (hash) {
  return imgur.deleteImage(hash)
}
