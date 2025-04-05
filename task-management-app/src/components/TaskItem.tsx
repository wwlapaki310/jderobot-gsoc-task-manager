import React from 'react';
import { toggleTask, removeTask } from '../redux/tasksSlice';
import { useAppDispatch } from '../redux/hooks';
import { Task, TaskCategory } from '../types';

interface TaskItemProps {
  task: Task;
  index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();

  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2日以内

  // カテゴリに応じたCSSクラスを取得
  const getCategoryClass = (category: TaskCategory) => {
    const map: Record<TaskCategory, string> = {
      PERSONAL: 'personal',
      WORK: 'work',
      SHOPPING: 'shopping',
      OTHER: 'other',
    };
    return `category-${map[category] || 'other'}`;
  };

  // 期日のフォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const translatePriority = (priority: string): string => {
    switch (priority) {
      case 'HIGH': return '高';
      case 'MEDIUM': return '中';
      case 'LOW': return '低';
      default: return priority;
    }
  };

  const translateCategory = (category: TaskCategory): string => {
    switch (category) {
      case 'PERSONAL': return '個人';
      case 'WORK': return '仕事';
      case 'SHOPPING': return '買い物';
      case 'OTHER': return 'その他';
      default: return category;
    }
  };

  return (
    <li 
      className={`task-item priority-${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''} ${isDueSoon ? 'due-soon' : ''}`}
    >
      <div className="task-info">
        <div className="task-title">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => dispatch(toggleTask(task.id))}
          />
          <span style={{ marginLeft: '8px' }}>{task.title}</span>
        </div>
        <div className="task-meta">
          <span className={`category-tag ${getCategoryClass(task.category)}`}>
            {translateCategory(task.category)}
          </span>
          <span>優先度: {translatePriority(task.priority)}</span>
          {task.dueDate && (
            <span style={{ color: isPastDue ? 'red' : isDueSoon ? 'orange' : 'inherit' }}>
              期日: {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => dispatch(removeTask(task.id))}>削除</button>
      </div>
    </li>
  );
};

export default TaskItem;