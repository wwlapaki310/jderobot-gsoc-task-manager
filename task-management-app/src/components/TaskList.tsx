import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { updateTaskOrder } from '../redux/tasksSlice';
import TaskItem from './TaskItem';
import type { Task } from '../types/index';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, filter, categoryFilter, prioritySort, searchQuery } = useAppSelector(state => state.tasks);
  const { currentUser } = useAppSelector(state => state.auth);
  
  // タスクのフィルタリングとソート
  const filteredAndSortedTasks = useMemo(() => {
    // フィルタリング処理...
    let result = tasks.filter((task) => {
      // 検索クエリ、完了状態、カテゴリによるフィルタリング...
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompletionFilter = 
        filter === 'ALL' ||
        (filter === 'COMPLETED' && task.completed) ||
        (filter === 'ACTIVE' && !task.completed);
      const matchesCategoryFilter = 
        categoryFilter === 'ALL' || task.category === categoryFilter;
      
      return matchesSearch && matchesCompletionFilter && matchesCategoryFilter;
    });

    // ソート処理...
    // ソートなしの場合はorder属性でソート
    if (prioritySort === 'NONE') {
      result = [...result].sort((a, b) => {
        if (a.order === undefined && b.order === undefined) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return (a.order || 0) - (b.order || 0);
      });
    } else {
      // 優先度、期日などによるソート...
    }

    return result;
  }, [tasks, filter, categoryFilter, prioritySort, searchQuery]);

  // ドラッグセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      console.log("Dragging item:", active.id);
      console.log("Dropping over:", over.id);
      
      const oldIndex = filteredAndSortedTasks.findIndex(task => task.id === active.id);
      const newIndex = filteredAndSortedTasks.findIndex(task => task.id === over.id);
      
      console.log("Old index:", oldIndex, "New index:", newIndex);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // 新しい順序でタスクの配列を作成
        const newOrder = [...filteredAndSortedTasks];
        const [movedTask] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, movedTask);
        
        // 全タスクの順序を更新
        const updatedTasks = tasks.map(task => {
          const newOrderIndex = newOrder.findIndex(t => t.id === task.id);
          if (newOrderIndex !== -1) {
            // フィルタリングされたリストに含まれるタスク
            return { ...task, order: newOrderIndex };
          } else {
            // フィルタリングされていないタスク
            return { ...task, order: newOrder.length + tasks.indexOf(task) };
          }
        });
        
        console.log("Updated tasks:", updatedTasks);
        
        // Reduxストアを更新
        dispatch(updateTaskOrder(updatedTasks));
      }
    }
  };

  // タスクの表示
  if (filteredAndSortedTasks.length === 0) {
    return <p>タスクがありません。新しいタスクを追加してください。</p>;
  }

  const taskIds = filteredAndSortedTasks.map(task => task.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <ul className="task-list">
          {filteredAndSortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;