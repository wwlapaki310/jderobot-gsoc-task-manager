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
    // まず現在のユーザーのタスクをフィルタリング
    let result = tasks.filter((task) => {
      // 現在のユーザーIDでフィルタリング
      const isCurrentUserTask = currentUser ? task.userId === currentUser.id : false;
      
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
      
      return isCurrentUserTask && matchesSearch && matchesCompletionFilter && matchesCategoryFilter;
    });

    // ユーザーが特定のソートを選択していない場合は、order属性によるソートを適用
    if (prioritySort === 'NONE') {
      result = [...result].sort((a, b) => {
        // orderがない場合は作成日時でソート
        if (a.order === undefined && b.order === undefined) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // orderがある場合はそれでソート
        return (a.order || 0) - (b.order || 0);
      });
    } else {
      // ユーザーが選択したソート方法を適用
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
  }, [tasks, currentUser, filter, categoryFilter, prioritySort, searchQuery]);

  // センサーの設定（ドラッグの検出方法）
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
      const oldIndex = filteredAndSortedTasks.findIndex(task => task.id === active.id);
      const newIndex = filteredAndSortedTasks.findIndex(task => task.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // 並び替えた配列を作成
        const newFilteredTasks = arrayMove(filteredAndSortedTasks, oldIndex, newIndex);
        
        // 新しいタスクリストを作成（イミュータブルに）
        const allTasks = tasks.map(task => ({...task})); // ディープコピー
        
        // フィルタリングされていないタスクを含む、完全なタスクリストを更新
        newFilteredTasks.forEach((task, index) => {
          const taskIndex = allTasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            // 新しいオブジェクトを作成して代入
            allTasks[taskIndex] = {
              ...allTasks[taskIndex],
              order: index
            };
          }
        });
        
        // 表示されていないタスクにも順番を割り当てる
        let maxOrder = newFilteredTasks.length - 1;
        const updatedTasks = allTasks.map(task => {
          if (!newFilteredTasks.some(t => t.id === task.id)) {
            return {
              ...task,
              order: ++maxOrder
            };
          }
          return task;
        });
        
        // Reduxストアを更新
        dispatch(updateTaskOrder(updatedTasks));
      }
    }
  };

  if (!currentUser) {
    return <p>ログインしてください</p>;
  }

  if (filteredAndSortedTasks.length === 0) {
    return <p>タスクがありません。新しいタスクを追加してください。</p>;
  }

  // タスクIDの配列を作成（SortableContextで使用）
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