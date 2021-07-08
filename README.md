# cornerstoneSideImageLoader
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://sisobus.com"><img src="https://avatars.githubusercontent.com/u/3329885?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sangkeun Kim/김상근</b></sub></a><br /><a href="https://github.com/plantarflex/cornerstoneSideImageLoader/commits?author=sisobus" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!