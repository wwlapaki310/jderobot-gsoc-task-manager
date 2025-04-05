import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthState } from '../types/index';

// ローカルストレージからユーザー情報を取得
const loadUsers = (): User[] => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (err) {
    console.error('Error loading users from localStorage:', err);
    return [];
  }
};

// ローカルストレージにユーザー情報を保存
const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to localStorage:', err);
  }
};

// ローカルストレージから現在のユーザー情報を取得
const loadCurrentUser = (): User | null => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  } catch (err) {
    console.error('Error loading current user from localStorage:', err);
    return null;
  }
};

// ローカルストレージに現在のユーザー情報を保存
const saveCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  } catch (err) {
    console.error('Error saving current user to localStorage:', err);
  }
};

const initialState: AuthState = {
  currentUser: loadCurrentUser(),
  isAuthenticated: !!loadCurrentUser(),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerRequest: (state, action: PayloadAction<{ username: string; password: string }>) => {
      const users = loadUsers();
      
      // ユーザー名の重複チェック
      if (users.some(user => user.username === action.payload.username)) {
        state.error = 'このユーザー名は既に使用されています';
        return;
      }
      
      // 新しいユーザーを作成
      const newUser: User = {
        id: uuidv4(),
        username: action.payload.username,
        password: action.payload.password, // 実際のプロダクションではハッシュ化が必要
      };
      
      // ユーザーリストに追加して保存
      users.push(newUser);
      saveUsers(users);
      
      // 新しいユーザーでログイン状態にする
      state.currentUser = newUser;
      state.isAuthenticated = true;
      state.error = null;
      saveCurrentUser(newUser);
    },
    
    loginRequest: (state, action: PayloadAction<{ username: string; password: string }>) => {
      const users = loadUsers();
      
      // ユーザー名とパスワードをチェック
      const user = users.find(
        u => u.username === action.payload.username && u.password === action.payload.password
      );
      
      if (!user) {
        state.error = 'ユーザー名またはパスワードが正しくありません';
        return;
      }
      
      // ログイン状態を更新
      state.currentUser = user;
      state.isAuthenticated = true;
      state.error = null;
      saveCurrentUser(user);
    },
    
    logoutRequest: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      saveCurrentUser(null);
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { registerRequest, loginRequest, logoutRequest, clearError } = authSlice.actions;
export default authSlice.reducer;