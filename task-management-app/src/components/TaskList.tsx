import React, { useMemo } from 'react';
import { useAppSelector } from '../redux/hooks';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
  const { tasks, filter, categoryFilter, prioritySort, searchQuery } = useAppSelector(state => state.tasks);

  // タスクのフィルタリングとソート
  const filteredAndSortedTasks = useMemo(() => {
    // フィルタリング
    let result = tasks.filter((task) => {
      // 検索クエリによるフィルタリング
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 完了状態によるフィルタリング
      const matchesCompletionFilter = 
        filter === 'ALL' ||
        (filter === 'COMPLETED' && task.completed) ||
        (filter === 'ACTIVE' && !task.completed);
      
      // カテゴリによるフィルタリング
      const matchesCategoryFilter = 
        categoryFilter === 'ALL' || task.category === categoryFilter;
      
      return matchesSearch && matchesCompletionFilter && matchesCategoryFilter;
    });

    // ソート
    if (prioritySort !== 'NONE') {
      result = [...result].sort((a, b) => {
        if (prioritySort === 'HIGH_FIRST') {
          // 優先度の高い順
          const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (prioritySort === 'LOW_FIRST') {
          // 優先度の低い順
          const priorityOrder: Record<string, number> = { HIGH: 2, MEDIUM: 1, LOW: 0 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (prioritySort === 'DUE_DATE') {
          // 期日順
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });
    }

    return result;
  }, [tasks, filter, categoryFilter, prioritySort, searchQuery]);

  if (filteredAndSortedTasks.length === 0) {
    return <p>タスクがありません。新しいタスクを追加してください。</p>;
  }

  return (
    <ul className="task-list">
      {filteredAndSortedTasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
        />
      ))}
    </ul>
  );
};

export default TaskList;