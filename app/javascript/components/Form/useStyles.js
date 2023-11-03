import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },

  errorText: {
    color: 'red',
  },
}));

export default useStyles;
