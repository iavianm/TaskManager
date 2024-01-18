import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import Form from 'components/Form';

import useStyles from 'components/EditPopup/useStyles';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import TaskPresenter from 'presenters/TaskPresenter';
import useTasks from 'hooks/store/useTasks';

function EditPopup({ cardId, onClose, onCardLoad }) {
  const [task, setTask] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const styles = useStyles();
  const [changeImage, setChangeImage] = useState(false);

  const { attachTaskImage, removeTaskImage, updateTask, deleteTask } = useTasks();

  useEffect(() => {
    onCardLoad(cardId).then(setTask);
  }, [changeImage]);

  const handleTaskUpdate = () => {
    setSaving(true);

    updateTask(task)
      .then(() => onClose())
      .catch((error) => {
        setSaving(false);
        setErrors(error || {});
        if (error instanceof Error) {
          alert(`Update Failed! Error: ${error.message}`);
        }
        console.log(error);
      });
  };

  const handleTaskDestroy = () => {
    setSaving(true);

    deleteTask(task)
      .then(() => onClose())
      .catch((error) => {
        setSaving(false);

        alert(`Destrucion Failed! Error: ${error.message}`);
        console.log(error);
      });
  };

  const isLoading = isNil(task);

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title={
            isLoading ? 'Your task is loading. Please be patient.' : `Task # ${task.id} [${TaskPresenter.name(task)}]`
          }
        />
        <CardContent>
          {isLoading ? (
            <div className={styles.loader}>
              <CircularProgress />
            </div>
          ) : (
            <Form
              errors={errors}
              changeImage={changeImage}
              setErrors={setErrors}
              onChange={setTask}
              setChangeImage={setChangeImage}
              task={task}
              onAttachImage={attachTaskImage}
              onRemoveImage={removeTaskImage}
            />
          )}
        </CardContent>
        <CardActions className={styles.actions}>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleTaskUpdate}
            size="small"
            variant="contained"
            color="primary"
          >
            Update
          </Button>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleTaskDestroy}
            size="small"
            variant="contained"
            color="secondary"
          >
            Destroy
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

EditPopup.propTypes = {
  cardId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onCardLoad: PropTypes.func.isRequired,
};

export default EditPopup;
