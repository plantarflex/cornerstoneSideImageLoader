import loadImage from "./loadImage"
import metaDataProvider from "./metaData/metaDataProvider"

export default function (cornerstone) {
  cornerstone.registerImageLoader("coronal", loadImage)
  cornerstone.registerImageLoader("sagittal", loadImage)

  cornerstone.metaData.addProvider(metaDataProvider)
}
