# cornerstoneSideImageLoader
An MPR image loader that reconstructs coronal and sagittal images from axial images.

<br>

![7323b53f1068](https://user-images.githubusercontent.com/31844264/115286800-7545ce80-a18a-11eb-90dd-12b5496660d8.gif)

## Dependencies 

* [cornerstone-core](https://github.com/cornerstonejs/cornerstone)

## Demo
Right viewport displays original axial images. Left viewports display multiplanar-reconstructed coronal and sagittal images.

[LIVE DEMONSTRATION](https://plantarflex.github.io/cornerstoneSideImageLoader/)

## Installation

```sh
$ yarn add cornerstone-side-image-loader
```

or

```sh
$ npm i cornerstonetools-side-image-loader
```

## Example

```js
import cornerstone from 'cornerstone-core'
import cornerstoneSideImageLoader, { generateSideImages } from "cornerstone-side-image-loader"

cornerstoneSideImageLoader.external.cornerstone = cornerstone

const loadAxialImages = Promise.all(
  imageIds.map((imageId) => cornerstone.loadAndCacheImage(imageId)),
)
loadAxialImages.then(images => {
  const { coronalImageIds, sagittalImageIds } = generateSideImages(images)
  // do coronal and sagittal business
  coronalImageIds.map((imageId) => cornerstone.loadImage(imageId))
  sagittalImageIds.map((imageId) => cornerstone.loadImage(imageId))
})
```

## LICENSE

MIT
