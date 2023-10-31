import React from 'react';
import store from '../../store/store';
import { Provider } from 'react-redux';
import TaskBoard from 'components/TaskBoard';

function App() {
  return (
    <Provider store={store}>
      <TaskBoard />
    </Provider>
  );
}

export default App;
