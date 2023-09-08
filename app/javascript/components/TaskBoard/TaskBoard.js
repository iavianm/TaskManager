import '@lourenci/react-kanban/dist/styles.css';

import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import { propOr } from 'ramda';

import Task from '../Task';
import TasksRepository from '../../repositories/TasksRepository';
import ColumnHeader from '../ColumnHeader';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

function TaskBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);

  const loadColumn = (state, page, perPage) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });

  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => {
        const currentCards = prevState[state]?.cards || [];
        const currentMeta = prevState[state]?.meta || {};

        const newCards = [...currentCards, ...data.items];
        const newMeta = { ...currentMeta, ...data.meta };

        return {
          ...prevState,
          [state]: { cards: newCards, meta: newMeta },
        };
      });
    });
  };

  const generateBoard = () => {
    const newBoard = {
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    };

    setBoard(newBoard);
  };

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };

  useEffect(() => loadBoard(), []);
  useEffect(() => generateBoard(), [boardCards]);

  return (
    <KanbanBoard
      renderCard={(card) => <Task task={card} />}
      renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
    >
      {board}
    </KanbanBoard>
  );
}

export default TaskBoard;
