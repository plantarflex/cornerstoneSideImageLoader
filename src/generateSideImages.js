import { v4 as uuid } from "uuid"
import getImagePositions from "./getImagePositions"
import getNumberValues from "./metaData/getNumberValues"
import { addImageLoaderCache } from "./store"

const getTypedArray = (imageMeta) => {
  const { rows, columns, bitsAllocated, pixelRepresentation } = imageMeta
  if (bitsAllocated === 32) {
    return new Float32Array(rows * columns)
  } else if (bitsAllocated === 16) {
    if (pixelRepresentation === 0) {
      return new Uint16Array(rows * columns)
    } else {
      return new Int16Array(rows * columns)
    }
  } else {
    return new Uint8Array(rows * columns)
  }
}

const saveCoronalDatas = (
  pixelDatas,
  imageMeta,
  imagePositions,
  n,
  cosineRatio,
) => {
  const imageIds = []
  const { rows, columns } = imageMeta
  for (let l = 0; l < columns; l = l + 1) {
    const imageId = `coronal://${uuid()}`
    imageIds.push(imageId)
    let cnt = 0
    const newImagePixelData = getTypedArray(imageMeta)
    let [mn, mx] = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    for (let i = 0; i < n; i = i + 1) {
      for (let j = 0; j < columns; j = j + 1) {
        const k = columns * l + j
        mn = Math.min(mn, pixelDatas[i][k])
        mx = Math.max(mx, pixelDatas[i][k])
        newImagePixelData[cnt++] = pixelDatas[i][k]
      }
    }
    const imageOrientationPatient = [1, 0, 0, 0, 0, -1]
    const rowCosines = imageOrientationPatient.slice(0, 3)
    const columnCosines = imageOrientationPatient
      .slice(3)
      .map((x) => x * cosineRatio)
    const newImage = {
      ...imageMeta,
      imageId,
      rowCosines,
      columnCosines,
      imageOrientationPatient,
      imagePositionPatient: imagePositions[l],
      getPixelData: () => newImagePixelData,
      originalHeight: n,
      view: "coronal",
      cosineRatio,
      minPixelValue: mn,
      maxPixelValue: mx,
    }
    addImageLoaderCache(imageId, newImage)
  }
  return imageIds
}

const saveSagittalDatas = (
  pixelDatas,
  imageMeta,
  imagePositions,
  n,
  cosineRatio,
) => {
  const imageIds = []
  const { rows, columns } = imageMeta
  for (let l = columns - 1; l >= 0; l = l - 1) {
    const imageId = `sagittal://${uuid()}`
    imageIds.push(imageId)
    let cnt = 0
    const newImagePixelData = getTypedArray(imageMeta)
    let [mn, mx] = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    for (let i = 0; i < n; i = i + 1) {
      for (let j = 0; j < columns; j = j + 1) {
        const k = j * columns + l
        mn = Math.min(mn, pixelDatas[i][k])
        mx = Math.max(mx, pixelDatas[i][k])
        newImagePixelData[cnt++] = pixelDatas[i][k]
      }
    }
    const imageOrientationPatient = [0, 1, 0, 0, 0, -1]
    const rowCosines = imageOrientationPatient.slice(0, 3)
    const columnCosines = imageOrientationPatient
      .slice(3)
      .map((x) => x * cosineRatio)
    const newImage = {
      ...imageMeta,
      imageId,
      rowCosines,
      columnCosines,
      imageOrientationPatient,
      imagePositionPatient: imagePositions[l],
      getPixelData: () => newImagePixelData,
      originalHeight: n,
      view: "sagittal",
      cosineRatio,
      minPixelValue: mn,
      maxPixelValue: mx,
    }
    addImageLoaderCache(imageId, newImage)
  }
  return imageIds
}

const generateSideImages = (images) => {
  if (images.length <= 0) {
    return null
  }
  const baseImage = images[0]
  const lastImage = images[images.length - 1]
  const pixelDatas = images.map((image) => image.getPixelData())
  const rows = images.length
  const columns = baseImage.columns
  const meta = {
    color: baseImage.color,
    columnPixelSpacing: baseImage.columnPixelSpacing,
    columns: baseImage.columns,
    height: rows,
    intercept: baseImage.intercept,
    invert: baseImage.invert,
    rowPixelSpacing: baseImage.rowPixelSpacing * (columns / rows),
    rows: rows,
    sizeInBytes: pixelDatas[0].length,
    slope: baseImage.slope,
    width: baseImage.columns,
    windowCenter: baseImage.windowCenter,
    windowWidth: baseImage.windowWidth,
    decodeTimeInMS: baseImage.decodeTimeInMS,
    floatPixelData: undefined,
    frameOfReferenceUID: baseImage.data.string("x00200052"),
    sliceThickness: baseImage.data.floatString("x00180050"),
    sliceLocation: baseImage.data.floatString("x00201041"),
    bitsAllocated: baseImage.data.uint16("x00280100"),
    pixelRepresentation: baseImage.data.uint16("x00280103"),
    data: baseImage.data,
  }
  const imageOrientationPatient = getNumberValues(
    baseImage.data,
    "x00200037",
    6,
  )
  const pixelSpacing = getNumberValues(baseImage.data, "x00280030", 2)
  const imagePositionPatient = getNumberValues(baseImage.data, "x00200032", 3)
  const lastImagePositionPaitnet = getNumberValues(
    lastImage.data,
    "x00200032",
    3,
  )
  const range = lastImagePositionPaitnet[2] - imagePositionPatient[2]
  const cosineRatio = Math.abs(range / (rows * meta.rowPixelSpacing))
  const imagePositions = getImagePositions(
    imageOrientationPatient,
    pixelSpacing,
    imagePositionPatient,
    columns,
  )
  meta.pixelSpacing = pixelSpacing
  meta.imageOrientationPatient = imageOrientationPatient
  meta.rowCosines = imageOrientationPatient.slice(0, 3)
  meta.columnCosines = imageOrientationPatient.slice(3)
  const coronalImageIds = saveCoronalDatas(
    pixelDatas,
    meta,
    imagePositions.coronal,
    rows,
    cosineRatio,
  )
  const sagittalImageIds = saveSagittalDatas(
    pixelDatas,
    meta,
    imagePositions.sagittal,
    rows,
    cosineRatio,
  )
  return {
    coronalImageIds,
    sagittalImageIds,
  }
}

export default generateSideImages
