import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },

  imageUploadContainer: {
    marginBottom: 10,
    marginTop: 10,
  },

  previewContainer: {
    display: 'flex',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 300,
  },

  preview: {
    objectFit: 'cover',
    maxWidth: '99%',
    height: 300,
  },

  imageButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
}));

export default useStyles;
