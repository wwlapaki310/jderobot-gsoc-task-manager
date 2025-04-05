export type TaskCategory = 'PERSONAL' | 'WORK' | 'SHOPPING' | 'OTHER';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskFilter = 'ALL' | 'ACTIVE' | 'COMPLETED';
export type CategoryFilter = TaskCategory | 'ALL';
export type PrioritySort = 'NONE' | 'HIGH_FIRST' | 'LOW_FIRST' | 'DUE_DATE';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  order?: number; // タスクの表示順
}

export interface TasksState {
  tasks: Task[];
  filter: TaskFilter;
  categoryFilter: CategoryFilter;
  prioritySort: PrioritySort;
  searchQuery: string;
}


export interface User {
    id: string;
    username: string;
    password: string;
  }
  
export interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
}