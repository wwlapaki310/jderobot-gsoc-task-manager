// src/redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthState } from '../types/index';

// ローカルストレージからユーザー情報を取得
const loadUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// ローカルストレージにユーザー情報を保存
const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// ローカルストレージから現在のユーザー情報を取得
const loadCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
};

// ローカルストレージに現在のユーザー情報を保存
const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

const initialState: AuthState = {
  currentUser: loadCurrentUser(),
  isAuthenticated: !!loadCurrentUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action: PayloadAction<{ username: string; password: string }>) => {
      const users = loadUsers();
      
      // ユーザー名の重複チェック
      if (users.some(user => user.username === action.payload.username)) {
        throw new Error('このユーザー名は既に使用されています');
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
      saveCurrentUser(newUser);
    },
    
    login: (state, action: PayloadAction<{ username: string; password: string }>) => {
      const users = loadUsers();
      
      // ユーザー名とパスワードをチェック
      const user = users.find(
        u => u.username === action.payload.username && u.password === action.payload.password
      );
      
      if (!user) {
        throw new Error('ユーザー名またはパスワードが正しくありません');
      }
      
      // ログイン状態を更新
      state.currentUser = user;
      state.isAuthenticated = true;
      saveCurrentUser(user);
    },
    
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      saveCurrentUser(null);
    },
  },
});

export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;