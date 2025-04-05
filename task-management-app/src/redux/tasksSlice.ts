import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Task, TasksState, TaskCategory, TaskPriority } from '../types';

interface AddTaskPayload {
  title: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  dueDate?: string | null;
}

interface UpdateTaskPayload extends Partial<Task> {
  id: string;
}

const initialState: TasksState = {
  tasks: [],
  filter: 'ALL',
  categoryFilter: 'ALL',
  prioritySort: 'NONE',
  searchQuery: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<AddTaskPayload>) => {
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title,
        completed: false,
        category: action.payload.category || 'PERSONAL',
        priority: action.payload.priority || 'MEDIUM',
        dueDate: action.payload.dueDate || null,
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTaskOrder: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setFilter: (state, action: PayloadAction<TasksState['filter']>) => {
      state.filter = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<TasksState['categoryFilter']>) => {
      state.categoryFilter = action.payload;
    },
    setPrioritySort: (state, action: PayloadAction<TasksState['prioritySort']>) => {
      state.prioritySort = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateTask: (state, action: PayloadAction<UpdateTaskPayload>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    }
  },
});

export const {
  addTask,
  toggleTask,
  removeTask,
  updateTaskOrder,
  setFilter,
  setCategoryFilter,
  setPrioritySort,
  setSearchQuery,
  updateTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;