import { useSelector } from 'react-redux';
import { useTasksActions } from 'slices/TasksSlice';

const useTasks = () => {
  const board = useSelector((state) => state.TasksSlice.board);
  const {
    loadBoard,
    loadColumnMore,
    handleCardDragEnd,
    createTask,
    updateTask,
    deleteTask,
    attachTaskImage,
    removeTaskImage,
  } = useTasksActions();

  return {
    board,
    loadBoard,
    loadColumnMore,
    handleCardDragEnd,
    createTask,
    updateTask,
    deleteTask,
    attachTaskImage,
    removeTaskImage,
  };
};

export default useTasks;
