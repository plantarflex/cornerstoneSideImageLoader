import { default as createImage } from "./createImage"
import { default as external } from "./externalModules"
import { default as imagePosition } from "./getImagePositions"
import { default as loadImage } from "./loadImage"
import { default as parseImageId } from "./parseImageId"
import { default as register } from "./register"
import { default as registerLoaders } from "./registerLoaders"
import { default as saveSideViewImages } from "./saveSideViewImages"
import {
  getImageInImageLoaderCache,
  addImageLoaderCache,
  removeImageLoaderCache,
  resetImageLoaderCache,
} from "./store"

const sideViewLoader = {
  createImage,
  external,
  imagePosition,
  loadImage,
  parseImageId,
  register,
  registerLoaders,
  saveSideViewImages,
  getImageInImageLoaderCache,
  addImageLoaderCache,
  removeImageLoaderCache,
  resetImageLoaderCache,
}

export default sideViewLoader
