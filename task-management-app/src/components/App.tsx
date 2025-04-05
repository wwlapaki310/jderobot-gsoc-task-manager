import React from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import SearchBar from './SearchBar';

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>タスク管理アプリ</h1>
      <TaskForm />
      <SearchBar />
      <TaskFilter />
      <TaskList />
    </div>
  );
};

export default App;