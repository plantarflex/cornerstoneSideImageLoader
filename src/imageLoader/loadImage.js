import createImage from "./createImage"
const loadImage = (imageId, options = {}) => {
  const promise = createImage(imageId)
  return {
    promise,
  }
}
export default loadImage
