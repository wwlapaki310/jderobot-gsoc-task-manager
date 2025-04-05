import React from 'react';
import { toggleTask, removeTask } from '../redux/tasksSlice';
import { useAppDispatch } from '../redux/hooks';
import { Task, TaskCategory } from '../types/index';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();

  // ドラッグ＆ドロップの設定
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  // スタイルを計算
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  // タスクのスタイルや表示に関する計算
  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  // 各種ヘルパー関数
  const getCategoryClass = (category: TaskCategory): string => {
    const map: Record<TaskCategory, string> = {
      PERSONAL: 'personal',
      WORK: 'work',
      SHOPPING: 'shopping',
      OTHER: 'other',
    };
    return `category-${map[category] || 'other'}`;
  };
  
  const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // 表示用の変換関数
  // 優先度を日本語に変換
const translatePriority = (priority: string): string => {
    switch (priority) {
      case 'HIGH': return '高';
      case 'MEDIUM': return '中';
      case 'LOW': return '低';
      default: return priority;
    }
  };

  // カテゴリを日本語に変換
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
      ref={setNodeRef}
      style={style}
      className={`task-item priority-${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''} ${isDueSoon ? 'due-soon' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-info">
        {/* タスク情報の表示 */}
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