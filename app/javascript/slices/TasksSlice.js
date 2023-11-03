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
      const column = state.board.columns.find((c) => c.id === columnId);

      state.board = changeColumn(state.board, column, {
        cards: items,
        meta,
      });

      return state;
    },
    loadColumnMoreSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find((c) => c.id === columnId);

      state.board = changeColumn(state.board, column, {
        cards: [...column.cards, ...items],
        meta,
      });

      return state;
    },
    createTaskSuccess(state, { payload }) {
      const column = state.board.columns.find((c) => c.id === payload.state);
      const { cards, meta } = column;
      const newCards = [payload, ...cards.slice(0, -1)];
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
    updateTaskSuccess(state, { payload }) {
      const column = state.board.columns.find((c) => c.id === payload.state);
      const { cards, meta } = column;
      const updatedCards = cards.map((card) => (card.id === payload.id ? payload : card));

      state.board = changeColumn(state.board, column, {
        cards: updatedCards,
        meta,
      });

      return state;
    },
    deleteTaskSuccess(state, { payload }) {
      const column = state.board.columns.find((c) => c.id === payload.state);
      const { cards, meta } = column;
      const updatedCards = cards.filter((card) => card.id !== payload.id);

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
    addTaskSuccess(state, { payload }) {
      const card = payload.items[0];
      const column = state.board.columns.find((c) => c.id === card.state);
      const { cards, meta } = column;

      state.board = changeColumn(state.board, column, {
        cards: [...cards, card],
        meta,
      });

      return state;
    },
  },
});

const { loadColumnSuccess, loadColumnMoreSuccess, createTaskSuccess, updateTaskSuccess, deleteTaskSuccess, addTaskSuccess } =
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
      dispatch(createTaskSuccess(task));
    });
  };

  const updateTask = (updatedTask) => {
    const attributes = TaskForm.attributesToSubmit(updatedTask);

    return TasksRepository.update(updatedTask.id, attributes).then(({ data: { task } }) => {
      dispatch(updateTaskSuccess(task));
    });
  };

  const lastTaskStateId = (state) => {
    const column = board.columns.find((c) => c.id === state);
    if (column.cards.length === 0) {
      return null;
    }
    return column.cards[column.cards.length - 1].id;
  };

  const deleteTask = (task) => {
    TasksRepository.destroy(task.id).then(() => {
      dispatch(deleteTaskSuccess(task));
    });

    const lastCardId = lastTaskStateId(task.state);

    return TasksRepository.index({
      q: { stateEq: task.state, idLt: lastCardId },
      page: 1,
      perPage: 1,
    }).then(({ data }) => {
      if (data.items.length > 0) {
        dispatch(addTaskSuccess(data));
      }
    });
  };

  return {
    loadBoard,
    loadColumnMore,
    handleCardDragEnd,
    createTask,
    updateTask,
    deleteTask,
  };
};
