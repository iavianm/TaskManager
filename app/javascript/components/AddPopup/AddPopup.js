import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

import TaskForm from 'forms/TaskForm';

import useStyles from 'components/AddPopup/useStyles';
import TaskPresenter from 'presenters/TaskPresenter';
import useTasks from 'hooks/store/useTasks';

function AddPopup({ onClose }) {
  const [task, changeTask] = useState(TaskForm.defaultAttributes());
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const { createTask } = useTasks();

  const handleTaskCreate = () => {
    setSaving(true);

    createTask(task)
      .then(() => onClose())
      .catch((error) => {
        setSaving(false);
        setErrors(error || {});
        console.log(error);

        if (error instanceof Error) {
          alert(`Creation Failed! Error: ${error.message}`);
        }
      });
  };

  const handleChangeTextField = (fieldName) => (event) => {
    changeTask({ ...task, [fieldName]: event.target.value });
    setSaving(false);
    setErrors({});
  };
  const styles = useStyles();

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title="Add New Task"
        />
        <CardContent>
          <div className={styles.form}>
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
              margin="dense"
            />
          </div>
        </CardContent>
        <CardActions className={styles.actions}>
          <Button disabled={isSaving} onClick={handleTaskCreate} variant="contained" size="small" color="primary">
            Add
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

AddPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddPopup;
