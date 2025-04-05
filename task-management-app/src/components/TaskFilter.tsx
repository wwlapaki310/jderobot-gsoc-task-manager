import React from 'react';
import { setFilter, setCategoryFilter, setPrioritySort } from '../redux/tasksSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { TaskFilter as FilterType, CategoryFilter, PrioritySort } from '../types';

const TaskFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filter, categoryFilter, prioritySort } = useAppSelector(state => state.tasks);

  return (
    <div className="filters">
      <select
        value={filter}
        onChange={(e) => dispatch(setFilter(e.target.value as FilterType))}
      >
        <option value="ALL">すべてのタスク</option>
        <option value="ACTIVE">未完了のタスク</option>
        <option value="COMPLETED">完了済みのタスク</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => dispatch(setCategoryFilter(e.target.value as CategoryFilter))}
      >
        <option value="ALL">すべてのカテゴリ</option>
        <option value="PERSONAL">個人</option>
        <option value="WORK">仕事</option>
        <option value="SHOPPING">買い物</option>
        <option value="OTHER">その他</option>
      </select>

      <select
        value={prioritySort}
        onChange={(e) => dispatch(setPrioritySort(e.target.value as PrioritySort))}
      >
        <option value="NONE">ソートなし</option>
        <option value="HIGH_FIRST">優先度高→低</option>
        <option value="LOW_FIRST">優先度低→高</option>
        <option value="DUE_DATE">期日順</option>
      </select>
    </div>
  );
};

export default TaskFilter;