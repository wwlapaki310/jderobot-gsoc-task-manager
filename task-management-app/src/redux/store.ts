import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import { TasksState } from '../types';

// ローカルストレージからタスクを取得
const loadState = (): { tasks: TasksState } | undefined => {
  try {
    const serializedState = localStorage.getItem('tasks');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// ローカルストレージにタスクを保存
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      tasks: state.tasks
    });
    localStorage.setItem('tasks', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

// 初期状態のロード
const persistedState = loadState();

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: persistedState,
});

// ストアの変更を監視してローカルストレージに保存
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;