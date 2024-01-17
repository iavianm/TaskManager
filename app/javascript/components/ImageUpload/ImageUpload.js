import React, { useState } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Button from '@material-ui/core/Button';
import { isNil, path } from 'ramda';
import PropTypes from 'prop-types';

import useStyles from './useStyles';

function ImageUpload({ onUpload }) {
  const styles = useStyles();

  const DEFAULT_CROP_PARAMS = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    unit: '%',
  };

  const [fileAsBase64, changeFileAsBase64] = useState(null);
  const [cropParams, changeCropParams] = useState(DEFAULT_CROP_PARAMS);
  const [file, changeFile] = useState(null);
  const [image, changeImage] = useState(null);

  const handleCropComplete = (newCrop, newPercentageCrop) => {
    changeCropParams(newPercentageCrop);
  };

  const onImageLoaded = (loadedImage) => {
    const { naturalWidth: width, naturalHeight: height } = loadedImage.currentTarget;
    const aspectRatio = 1;

    const newCropParams = makeAspectCrop(DEFAULT_CROP_PARAMS, aspectRatio, width, height);
    changeCropParams(newCropParams);
    changeImage(loadedImage.currentTarget);
  };

  const getActualCropParameters = (width, height, params) => ({
    cropX: (params.x * width) / 100,
    cropY: (params.y * height) / 100,
    cropWidth: (params.width * width) / 100,
    cropHeight: (params.height * height) / 100,
  });

  const handleCropChange = (_, newCropParams) => {
    changeCropParams(newCropParams);
  };

  const handleSave = () => {
    const { naturalWidth: width, naturalHeight: height } = image;
    const actualCropParams = getActualCropParameters(width, height, cropParams);

    onUpload({ attachment: { ...actualCropParams, image: file } });
  };

  const handleImageRead = (newImage) => changeFileAsBase64(path(['target', 'result'], newImage));

  const handleLoadFile = (e) => {
    e.preventDefault();

    const [acceptedFile] = e.target.files;

    const fileReader = new FileReader();
    fileReader.onload = handleImageRead;
    fileReader.readAsDataURL(acceptedFile);
    changeFile(acceptedFile);
  };

  return fileAsBase64 ? (
    <>
      <div className={styles.cropContainer}>
        <div className={styles.crop}>
          <ReactCrop
            src={fileAsBase64}
            crop={cropParams}
            onImageLoaded={onImageLoaded}
            onComplete={handleCropComplete}
            onChange={handleCropChange}
            keepSelection
          >
            <img src={fileAsBase64} onLoad={onImageLoaded} alt="new" className={styles.cropImage} />
          </ReactCrop>
        </div>
      </div>
      <Button
        variant="contained"
        size="small"
        color="primary"
        disabled={isNil(image)}
        className={styles.imageButton}
        onClick={handleSave}
      >
        Save
      </Button>
    </>
  ) : (
    <label htmlFor="imageUpload">
      <Button
        variant="contained"
        size="small"
        component="span"
        className={`${styles.imageButton} ${styles.imageAddButton}`}
      >
        Add Image
      </Button>
      <input accept="image/*" id="imageUpload" type="file" onChange={handleLoadFile} hidden />
    </label>
  );
}

ImageUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ImageUpload;
