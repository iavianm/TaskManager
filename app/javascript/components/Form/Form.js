import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import TextField from '@material-ui/core/TextField';

import useStyles from 'components/Form/useStyles';
import UserSelect from 'components/UserSelect';
import TaskPresenter from 'presenters/TaskPresenter';

function Form({ errors, onChange, task, formErrors, handleButtonState, clearErrorMessage }) {
  const handleChangeTextField = (fieldName) => (event) => {
    onChange({ ...task, [fieldName]: event.target.value });
    handleButtonState();
    clearErrorMessage();
  };
  const styles = useStyles();

  const handleChangeSelect = (fieldName) => (user) => onChange({ ...task, [fieldName]: user });

  return (
    <form className={styles.root}>
      <TextField
        FormHelperTextProps={{ className: errors.name || formErrors.name ? styles.errorText : '' }}
        error={has('name', errors)}
        helperText={errors.name || formErrors.name}
        onChange={handleChangeTextField('name')}
        value={TaskPresenter.name(task)}
        label="Name"
        required
        margin="dense"
      />
      <TextField
        FormHelperTextProps={{ className: errors.description || formErrors.description ? styles.errorText : '' }}
        error={has('description', errors)}
        helperText={errors.description || formErrors.description}
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
  formErrors: PropTypes.shape().isRequired,
  handleButtonState: PropTypes.func.isRequired,
  clearErrorMessage: PropTypes.func.isRequired,
};

Form.defaultProps = {
  errors: {},
};

export default Form;
