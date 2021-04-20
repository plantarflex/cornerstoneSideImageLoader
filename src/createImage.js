import { getImageInImageLoaderCache } from "./store"
import external from './externalModules'

function isModalityLUTForDisplay(sopClassUid) {
  // special case for XA and XRF
  // https://groups.google.com/forum/#!searchin/comp.protocols.dicom/Modality$20LUT$20XA/comp.protocols.dicom/UBxhOZ2anJ0/D0R_QP8V2wIJ
  return (
    sopClassUid !== "1.2.840.10008.5.1.4.1.1.12.1" && // XA
    sopClassUid !== "1.2.840.10008.5.1.4.1.1.12.2.1"
  ) // XRF
}

const createImage = (imageId) => {
  const { cornerstone } = external
  const image = getImageInImageLoaderCache(imageId)
  return new Promise((resolve, reject) => {
    const voiLutModule = cornerstone.metaData.get("voiLutModule", imageId) || {}
    const modalityLutModule =
      cornerstone.metaData.get("modalityLutModule", imageId) || {}
    const sopCommonModule =
      cornerstone.metaData.get("sopCommonModule", imageId) || {}
    // Modality LUT
    if (
      modalityLutModule.modalityLUTSequence &&
      modalityLutModule.modalityLUTSequence.length > 0 &&
      isModalityLUTForDisplay(sopCommonModule.sopClassUID)
    ) {
      image.modalityLUT = modalityLutModule.modalityLUTSequence[0]
    }

    // VOI LUT
    if (voiLutModule.voiLUTSequence && voiLutModule.voiLUTSequence.length > 0) {
      image.voiLUT = voiLutModule.voiLUTSequence[0]
    }
    resolve(image)
  })
}

export default createImage
