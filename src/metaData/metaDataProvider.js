import dicomParser from "dicom-parser"
import getNumberValues from "./getNumberValues.js"
import parseImageId from "../parseImageId.js"
import { getImageInImageLoaderCache } from "../store"
import getImagePixelModule from "./getImagePixelModule.js"
import getOverlayPlaneModule from "./getOverlayPlaneModule.js"
import getLUTs from "./getLUTs.js"
import getModalityLUTOutputPixelRepresentation from "./getModalityLUTOutputPixelRepresentation.js"

function metaDataProvider(type, imageId) {
  // const parsedImageId = parseImageId(imageId)

  const image = getImageInImageLoaderCache(imageId)
  if (!image) return
  const dataSet = image.data

  if (!dataSet) {
    return
  }

  if (type === "generalSeriesModule") {
    return {
      modality: dataSet.string("x00080060"),
      seriesInstanceUID: dataSet.string("x0020000e"),
      seriesNumber: dataSet.intString("x00200011"),
      studyInstanceUID: dataSet.string("x0020000d"),
      seriesDate: dicomParser.parseDA(dataSet.string("x00080021")),
      seriesTime: dicomParser.parseTM(dataSet.string("x00080031") || ""),
    }
  }

  if (type === "patientStudyModule") {
    return {
      patientAge: dataSet.intString("x00101010"),
      patientSize: dataSet.floatString("x00101020"),
      patientWeight: dataSet.floatString("x00101030"),
    }
  }

  if (type === "imagePlaneModule") {
    // const imageOrientationPatient = getNumberValues(dataSet, 'x00200037', 6)
    // const imagePositionPatient = getNumberValues(dataSet, 'x00200032', 3)
    // const pixelSpacing = getNumberValues(dataSet, 'x00280030', 2)
    // let columnPixelSpacing = null
    // let rowPixelSpacing = null
    // if (pixelSpacing) {
    //   rowPixelSpacing = pixelSpacing[0]
    //   columnPixelSpacing = pixelSpacing[1]
    // }
    // let rowCosines = null
    // let columnCosines = null
    // if (imageOrientationPatient) {
    //   rowCosines = [
    //     parseFloat(imageOrientationPatient[0]),
    //     parseFloat(imageOrientationPatient[1]),
    //     parseFloat(imageOrientationPatient[2]),
    //   ]
    //   columnCosines = [
    //     parseFloat(imageOrientationPatient[3]),
    //     parseFloat(imageOrientationPatient[4]),
    //     parseFloat(imageOrientationPatient[5]),
    //   ]
    // }
    return {
      frameOfReferenceUID: image.frameOfReferenceUID,
      rows: image.rows,
      columns: image.columns,
      imageOrientationPatient: image.imageOrientationPatient,
      rowCosines: image.rowCosines,
      columnCosines: image.columnCosines,
      imagePositionPatient: image.imagePositionPatient,
      sliceThickness: image.sliceThickness,
      sliceLocation: image.sliceLocation,
      pixelSpacing: image.pixelSpacing,
      rowPixelSpacing: image.rowPixelSpacing,
      columnPixelSpacing: image.columnPixelSpacing,
      view: image.view,
      cosineRatio: image.cosineRatio,
    }
  }

  if (type === "imagePixelModule") {
    return getImagePixelModule(dataSet)
  }

  if (type === "modalityLutModule") {
    return {
      rescaleIntercept: dataSet.floatString("x00281052"),
      rescaleSlope: dataSet.floatString("x00281053"),
      rescaleType: dataSet.string("x00281054"),
      modalityLUTSequence: getLUTs(
        dataSet.uint16("x00280103"),
        dataSet.elements.x00283000,
      ),
    }
  }

  if (type === "voiLutModule") {
    const modalityLUTOutputPixelRepresentation = getModalityLUTOutputPixelRepresentation(
      dataSet,
    )

    return {
      windowCenter: getNumberValues(dataSet, "x00281050", 1),
      windowWidth: getNumberValues(dataSet, "x00281051", 1),
      voiLUTSequence: getLUTs(
        modalityLUTOutputPixelRepresentation,
        dataSet.elements.x00283010,
      ),
    }
  }

  if (type === "sopCommonModule") {
    return {
      sopClassUID: dataSet.string("x00080016"),
      sopInstanceUID: dataSet.string("x00080018"),
    }
  }

  if (type === "petIsotopeModule") {
    const radiopharmaceuticalInfo = dataSet.elements.x00540016

    if (radiopharmaceuticalInfo === undefined) {
      return
    }

    const firstRadiopharmaceuticalInfoDataSet =
      radiopharmaceuticalInfo.items[0].dataSet

    return {
      radiopharmaceuticalInfo: {
        radiopharmaceuticalStartTime: dicomParser.parseTM(
          firstRadiopharmaceuticalInfoDataSet.string("x00181072") || "",
        ),
        radionuclideTotalDose: firstRadiopharmaceuticalInfoDataSet.floatString(
          "x00181074",
        ),
        radionuclideHalfLife: firstRadiopharmaceuticalInfoDataSet.floatString(
          "x00181075",
        ),
      },
    }
  }

  if (type === "overlayPlaneModule") {
    return getOverlayPlaneModule(dataSet)
  }
}

export default metaDataProvider
