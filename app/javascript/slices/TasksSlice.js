import { propEq } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import TasksRepository from 'repositories/TasksRepository';
import { STATES } from 'presenters/TaskPresenter';
import { useDispatch, useSelector } from 'react-redux';
import { changeColumn } from '@asseinfo/react-kanban';
import TaskPresenter from 'presenters/TaskPresenter';
import TaskForm from 'forms/TaskForm';

const initialState = {
  board: {
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {},
    })),
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadColumnSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: items,
        meta,
      });

      return state;
    },
    loadColumnMoreSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: [...column.cards, ...items],
        meta,
      });

      return state;
    },
    loadNewTask(state, { payload }) {
      const { columnId, ...rest } = payload;
      const column = state.board.columns.find(propEq('id', columnId));
      const { cards, meta } = column;
      const newCards = [rest, ...cards.slice(0, -1)];
      const newMeta = {
        ...meta,
        totalCount: meta.totalCount + 1,
      };

      state.board = changeColumn(state.board, column, {
        cards: newCards,
        meta: newMeta,
      });

      return state;
    },
    loadUpdateTask(state, { payload }) {
      const { columnId, ...rest } = payload;
      const column = state.board.columns.find(propEq('id', columnId));
      const { cards, meta } = column;
      const updatedCards = cards.map((card) => (card.id === rest.id ? rest : card));

      state.board = changeColumn(state.board, column, {
        cards: updatedCards,
        meta,
      });

      return state;
    },
    loadNextTask(state, { payload }) {
      const { columnId, ...rest } = payload;
      const column = state.board.columns.find(propEq('id', columnId));
      const { cards, meta } = column;

      state.board = changeColumn(state.board, column, {
        cards: [...cards, rest],
        meta,
      });

      return state;
    },
    loadDeleteTask(state, { payload }) {
      const { columnId, ...rest } = payload;
      const column = state.board.columns.find(propEq('id', columnId));
      const { cards, meta } = column;
      const updatedCards = cards.filter((card) => card.id !== rest.id);

      const newMeta = {
        ...meta,
        totalCount: meta.totalCount - 1,
      };

      state.board = changeColumn(state.board, column, {
        cards: updatedCards,
        meta: newMeta,
      });

      return state;
    },
  },
});

const { loadColumnSuccess, loadColumnMoreSuccess, loadNewTask, loadUpdateTask, loadDeleteTask, loadNextTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;

export const useTasksActions = () => {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.TasksSlice.board);

  const loadColumn = (state, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    }).then(({ data }) => {
      dispatch(loadColumnSuccess({ ...data, columnId: state }));
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    }).then(({ data }) => {
      dispatch(loadColumnMoreSuccess({ ...data, columnId: state }));
    });
  };

  const loadBoard = () => STATES.forEach(({ key }) => loadColumn(key));

  const handleCardDragEnd = (task, source, destination) => {
    const transition = TaskPresenter.transitions(task).find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, { stateEvent: transition.event })
      .then(() => {
        loadColumn(destination.toColumnId);
        loadColumn(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const createTask = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      dispatch(loadNewTask({ columnId: TaskPresenter.state(task), ...task }));
    });
  };

  const updateTask = (updatedTask) => {
    const attributes = TaskForm.attributesToSubmit(updatedTask);

    return TasksRepository.update(updatedTask.id, attributes).then(({ data: { task } }) => {
      dispatch(loadUpdateTask({ columnId: TaskPresenter.state(task), ...task }));
    });
  };

  const getColumnTasksCount = (state) => {
    const column = board.columns.find(propEq('id', state));
    return column.cards.length;
  };

  const getNextTask = (state) => {
    const currentTasksCount = getColumnTasksCount(state);
    TasksRepository.next_task({
      q: { stateEq: state },
      offset: currentTasksCount - 1,
    })
      .then((response) => {
        if (response.status !== 204) {
          const { task } = response.data;
          dispatch(loadNextTask({ columnId: TaskPresenter.state(task), ...task }));
        }
      })
      .catch((error) => {
        console.error('Failed to fetch the next task:', error);
      });
  };

  const deleteTask = (task) =>
    TasksRepository.destroy(task).then(() => {
      dispatch(loadDeleteTask({ columnId: TaskPresenter.state(task), ...task }));
      getNextTask(TaskPresenter.state(task));
    });

  return {
    loadBoard,
    loadColumnMore,
    handleCardDragEnd,
    createTask,
    updateTask,
    deleteTask,
  };
};
