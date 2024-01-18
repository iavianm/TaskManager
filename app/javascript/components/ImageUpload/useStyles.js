import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  crop: {
    maxHeight: '100%',
  },
  imageButton: {
    position: 'absolute',
    bottom: 10,
  },
  imageAddButton: {
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  },
  cropContainer: {
    display: 'flex',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropImage: {
    objectFit: 'cover',
    maxWidth: '100%',
    height: 300,
    maxHeight: '100%',
  },
}));

export default useStyles;
