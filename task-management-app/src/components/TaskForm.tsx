import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addTask } from '../redux/tasksSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { TaskCategory, TaskPriority } from '../types/index';

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<TaskCategory>('PERSONAL');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(state => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() && currentUser) {
      dispatch(addTask({
        title,
        category,
        priority,
        dueDate: dueDate ? dueDate.toISOString() : null,
        userId: currentUser.id, // ユーザーIDを追加
      }));
      
      // フォームをリセット
      setTitle('');
      setCategory('PERSONAL');
      setPriority('MEDIUM');
      setDueDate(null);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="新しいタスクを入力..."
            style={{ flex: 1 }}
          />
        </div>
        
        <div className="form-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
          >
            <option value="PERSONAL">個人</option>
            <option value="WORK">仕事</option>
            <option value="SHOPPING">買い物</option>
            <option value="OTHER">その他</option>
          </select>
          
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="HIGH">高優先度</option>
            <option value="MEDIUM">中優先度</option>
            <option value="LOW">低優先度</option>
          </select>
          
          <DatePicker
            selected={dueDate}
            onChange={(date: Date | null) => setDueDate(date)}
            placeholderText="期日を選択..."
            dateFormat="yyyy/MM/dd"
            isClearable
          />
          
          <button type="submit">追加</button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;