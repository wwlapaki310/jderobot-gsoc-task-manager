import React from 'react';
import { useAppSelector } from '../redux/hooks';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import SearchBar from './SearchBar';
import Header from './Header';
import AuthContainer from './AuthContainer';

const App: React.FC = () => {
  const { isAuthenticated, currentUser } = useAppSelector(state => state.auth);

  return (
    <div className="container">
      {isAuthenticated && currentUser ? (
        <>
          <Header />
          <h1>タスク管理アプリ</h1>
          <TaskForm />
          <SearchBar />
          <TaskFilter />
          <TaskList />
        </>
      ) : (
        <AuthContainer />
      )}
    </div>
  );
};

export default App;