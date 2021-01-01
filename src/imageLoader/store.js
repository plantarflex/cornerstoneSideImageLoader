let imageLoaderCache = {}
const getImageInImageLoaderCache = (imageId) => imageLoaderCache[imageId]
const addImageLoaderCache = (imageId, image) => {
  imageLoaderCache[imageId] = image
}
const removeImageLoaderCache = (imageId) => {
  const image = imageLoaderCache[imageId]
  if (!image) {
    return image
  }
  delete imageLoaderCache[imageId]
  return image
}
const resetImageLoaderCache = () => {
  imageLoaderCache = {}
}

export {
  getImageInImageLoaderCache,
  addImageLoaderCache,
  removeImageLoaderCache,
  resetImageLoaderCache,
}
