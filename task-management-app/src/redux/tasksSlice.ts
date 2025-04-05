import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Task, TasksState, TaskCategory, TaskPriority } from '../types/index';

// インターフェース定義
interface AddTaskPayload {
  title: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  dueDate?: string | null;
  userId: string; // ユーザーIDは必須
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
    // タスク追加
    addTask: (state, action: PayloadAction<AddTaskPayload>) => {
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title,
        completed: false,
        category: action.payload.category || 'PERSONAL',
        priority: action.payload.priority || 'MEDIUM',
        dueDate: action.payload.dueDate || null,
        createdAt: new Date().toISOString(),
        order: state.tasks.length, // 順番を保存
        userId: action.payload.userId, // ユーザーID
      };
      state.tasks.push(newTask);
    },
    
    // タスク完了状態の切り替え
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task: Task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    
    // タスク削除
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task: Task) => task.id !== action.payload);
      
      // 削除後に残りのタスクの順番を更新
      state.tasks.forEach((task: Task, index: number) => {
        task.order = index;
      });
    },
    
    // タスク順序の更新（ドラッグ&ドロップ後）
    updateTaskOrder: (state, action: PayloadAction<Task[]>) => {
      // 受け取ったタスク配列をIDで検索して更新
      action.payload.forEach(updatedTask => {
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });
      
      // orderプロパティでソート
      state.tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    
    // フィルター設定
    setFilter: (state, action: PayloadAction<TasksState['filter']>) => {
      state.filter = action.payload;
    },
    
    // カテゴリフィルター設定
    setCategoryFilter: (state, action: PayloadAction<TasksState['categoryFilter']>) => {
      state.categoryFilter = action.payload;
    },
    
    // 優先度ソート設定
    setPrioritySort: (state, action: PayloadAction<TasksState['prioritySort']>) => {
      state.prioritySort = action.payload;
    },
    
    // 検索クエリ設定
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    // タスク更新
    updateTask: (state, action: PayloadAction<UpdateTaskPayload>) => {
      const index = state.tasks.findIndex((task: Task) => task.id === action.payload.id);
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