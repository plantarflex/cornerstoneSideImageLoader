import * as nj from "./lib/numjs"

const getMatrix = (orientation, pixelSpacings, imagePositions) => {
  const rowPixelSpacing = pixelSpacings[0]
  const columnPixelSpacing = pixelSpacings[1]
  const rowCosine = orientation.slice(0, 3)
  const columnCosine = orientation.slice(3)
  const Fr = nj.array([...rowCosine.map((x) => x * columnPixelSpacing), 0])
  const Fc = nj.array([...columnCosine.map((x) => x * rowPixelSpacing), 0])
  const zeros = nj.zeros([4])
  const S = nj.array([...imagePositions, 1])
  const matrix = nj.array([
    Fr.tolist(),
    Fc.tolist(),
    zeros.tolist(),
    S.tolist(),
  ])
  return matrix.transpose()
}

const getImagePosition = (matrix, i, isCoronal) => {
  const imagePosition = isCoronal
    ? matrix.dot(nj.array([0, i, 0, 1]))
    : matrix.dot(nj.array([i, 0, 0, 1]))
  return imagePosition.tolist()
}

const getImagePositions = (orientation, pixelSpacings, imagePositions, n) => {
  const coronal = []
  const sagittal = []
  const matrix = getMatrix(orientation, pixelSpacings, imagePositions)
  for (let i = 0; i < n; i = i + 1) {
    coronal.push(getImagePosition(matrix, i, true))
  }
  for (let i = 0; i < n; i = i + 1) {
    sagittal.push(getImagePosition(matrix, i, false))
  }
  return {
    coronal,
    sagittal,
  }
}

export default getImagePositions
