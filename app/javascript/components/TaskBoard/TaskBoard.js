import '@lourenci/react-kanban/dist/styles.css';

import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import Task from 'components/Task';
import TasksRepository from 'repositories/TasksRepository';
import ColumnHeader from 'components/ColumnHeader';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import useStyles from 'components/TaskBoard/useStyles';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import useTasks from 'hooks/store/useTasks';

function TaskBoard() {
  const { board, loadBoard, loadColumnMore, handleCardDragEnd } = useTasks();
  const MODES = {
    ADD: 'add',
    NONE: 'none',
    EDIT: 'edit',
  };
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);

  const styles = useStyles();

  useEffect(() => loadBoard(), []);

  const handleAddPopupOpen = () => {
    setMode(MODES.ADD);
  };

  const handleEditPopupOpen = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  return (
    <>
      <Fab className={styles.addButton} color="primary" aria-label="add" onClick={handleAddPopupOpen}>
        <AddIcon />
      </Fab>
      <KanbanBoard
        renderCard={(card) => <Task onClick={handleEditPopupOpen} task={card} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        onCardDragEnd={handleCardDragEnd}
      >
        {board}
      </KanbanBoard>
      {mode === MODES.ADD && <AddPopup onClose={handleClose} />}
      {mode === MODES.EDIT && <EditPopup onCardLoad={loadTask} onClose={handleClose} cardId={openedTaskId} />}
    </>
  );
}

export default TaskBoard;
