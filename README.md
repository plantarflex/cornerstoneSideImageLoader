# cornerstoneSideImageLoader
An image loader that reconstructs coronal and sagittal images from axial images.
<br>

## Dependencies 

* [cornerstone-core](https://github.com/cornerstonejs/cornerstone)

## Demo
Right viewport displays original input axial images. Left display reconstructed output coronal and sagittal images.

![7323b53f1068](https://user-images.githubusercontent.com/31844264/115286800-7545ce80-a18a-11eb-90dd-12b5496660d8.gif)


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
cornerstone.loadImage(imageIds[0])
  .then(image => {
    const { coronalImageIds, sagittalImageIds } = generateSideImages(images)
    cornerstone.loadImage(coronalImageIds[0])
    cornerstone.loadImage(sagittalImageIds[0])
  })
```

## LICENSE

MIT