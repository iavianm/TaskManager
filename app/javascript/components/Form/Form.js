import React from 'react';
import PropTypes from 'prop-types';
import { has, isNil } from 'ramda';

import TextField from '@material-ui/core/TextField';

import useStyles from 'components/Form/useStyles';
import UserSelect from 'components/UserSelect';
import TaskPresenter from 'presenters/TaskPresenter';
import ImageUpload from 'components/ImageUpload';
import Button from '@material-ui/core/Button';

function Form({ errors, setErrors, onChange, task, onAttachImage, onRemoveImage, setChangeImage, changeImage }) {
  const handleChangeTextField = (fieldName) => (event) => {
    onChange({ ...task, [fieldName]: event.target.value });
    setErrors({});
  };
  const styles = useStyles();

  const handleChangeSelect = (fieldName) => (user) => onChange({ ...task, [fieldName]: user });

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        onChange={handleChangeTextField('name')}
        value={TaskPresenter.name(task)}
        label="Name"
        required
        margin="dense"
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        onChange={handleChangeTextField('description')}
        value={TaskPresenter.description(task)}
        label="Description"
        required
        multiline
        margin="dense"
      />
      <UserSelect
        label="Author"
        value={TaskPresenter.author(task)}
        onChange={handleChangeSelect('author')}
        isDisabled
        isRequired
        error={has('author', errors)}
        helperText={errors.author}
        isClearable
      />
      <UserSelect
        label="Assignee"
        value={TaskPresenter.assignee(task)}
        onChange={handleChangeSelect('assignee')}
        isRequired
        isDisabled={false}
        error={has('assignee', errors)}
        helperText={errors.assignee}
        isClearable
      />

      {isNil(TaskPresenter.imageUrl(task)) ? (
        <div className={styles.imageUploadContainer}>
          <ImageUpload
            onUpload={(image) => onAttachImage(TaskPresenter.id(task), image).then(() => setChangeImage(!changeImage))}
          />
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <img className={styles.preview} src={TaskPresenter.imageUrl(task)} alt="Attachment" />
          <Button
            variant="contained"
            size="small"
            color="secondary"
            className={styles.imageButton}
            onClick={() => onRemoveImage(TaskPresenter.id(task)).then(() => setChangeImage(!changeImage))}
          >
            Remove image
          </Button>
        </div>
      )}
    </form>
  );
}

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  task: TaskPresenter.shape().isRequired,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string),
  }),
  setErrors: PropTypes.func.isRequired,
  onAttachImage: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  setChangeImage: PropTypes.func.isRequired,
  changeImage: PropTypes.bool.isRequired,
};

Form.defaultProps = {
  errors: {},
};

export default Form;
