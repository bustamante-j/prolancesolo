// Draggable task card component with drag-and-drop functionality
// Displays task information with status indicators, pricing, and interactive controls
// Supports focus mode highlighting, task hiding, and inline expansion functionality

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock, User, Calendar, CheckCircle, Circle, PlayCircle, EyeOff, XCircle, Focus, Edit3, Save, X, Trash2 } from 'lucide-react';
import StatusDropdown from '@/components/ui/StatusDropdown';
import { Task } from '@/types/task';
import { format } from 'date-fns';

interface DraggableTaskCardProps {
  task: Task;
  onClick?: () => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onHide?: (taskId: string) => void;
  onFocusMode?: (taskId: string) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  onOpenFullScreen?: (taskId: string) => void;
  isFocused?: boolean;
  progressPercent?: number;
}

export default function DraggableTaskCard({
  task,
  onClick,
  onStatusChange,
  onHide,
  onFocusMode,
  onUpdate,
  onDelete,
  onOpenFullScreen,
  isFocused = false,
  progressPercent = 0,
}: DraggableTaskCardProps) {
  // State for editing mode and form data
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    notes: task.notes || '',
    estimatedHours: task.estimatedHours,
    price: task.price
  });
  // State for focus button transition animation
  const [isFocusTransitioning, setIsFocusTransitioning] = useState(false);
  // Dnd-kit sortable hook for drag and drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // Apply transform styles for smooth drag animations
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Return appropriate status icon based on task status
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  // Return appropriate border/background colors based on task status
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'cancelled':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700';
    }
  };

  // Handle hide button click - prevents event bubbling
  const handleHideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onHide) {
      onHide(task.id);
    }
  };

  // Handle status button click - cycles through status states
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      // Cycle through statuses: todo -> in-progress -> done -> cancelled -> todo
      const nextStatus: Task['status'] =
        task.status === 'todo' ? 'in-progress' :
        task.status === 'in-progress' ? 'done' :
        task.status === 'done' ? 'cancelled' : 'todo';
      onStatusChange(task.id, nextStatus);
    }
  };

  // Handle focus mode button click
  const handleFocusModeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFocusMode) {
      setIsFocusTransitioning(true);
      // Add a small delay for the transition animation
      setTimeout(() => {
        onFocusMode(task.id);
        setIsFocusTransitioning(false);
      }, 200);
    }
  };

  // Handle edit save
  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate(task.id, editData);
    }
    setIsEditing(false);
  };

  // Handle edit cancel
  const handleCancelEdit = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      notes: task.notes || '',
      estimatedHours: task.estimatedHours,
      price: task.price
    });
    setIsEditing(false);
  };

  return (
    // Main task card container with drag ref and conditional styling
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative border rounded-xl transition-all duration-200 hover:shadow-lg ${
        isFocused
          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20'
          : getStatusColor(task.status)
      } ${isDragging ? 'opacity-50 shadow-2xl' : ''}` }
    >
      {/* Drag handle - only visible on hover */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
      </div>

      {/* Compact Card View - clicking opens fullscreen detail modal */}
      <div className="p-6 cursor-pointer" onClick={() => onOpenFullScreen?.(task.id)}>
        <div className="flex items-start space-x-3">
          {/* Status dropdown - replaces cycling icon */}
          <div className="flex-shrink-0 mt-1">
            <div onClick={(e) => e.stopPropagation()}>
              {/* Use StatusDropdown component */}
              <StatusDropdown current={task.status as any} onChange={(s) => onStatusChange?.(task.id, s)} />
            </div>
          </div>

          {/* Main task content area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              {/* Task title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate pr-2">
                {task.title}
              </h3>
              {/* Price and hide/delete buttons */}
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                <span className="font-medium">₱</span>
                <span>{task.price.toLocaleString()}</span>
                {onHide && (
                  <button
                    onClick={handleHideClick}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    title="Hide task"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Task description - conditionally rendered */}
            {task.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

              {/* Task metadata row */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  {/* Client name */}
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span className="truncate max-w-24">{task.clientId}</span>
                  </div>
                  {/* Estimated hours */}
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.estimatedHours}h</span>
                  </div>
                  {/* Deadline date */}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(task.deadline, 'MMM dd')}</span>
                  </div>
                </div>

                {/* Focus button, Progress, and Paid status */}
                <div className="flex items-center space-x-3">
                  {onFocusMode && (
                    <button
                      onClick={handleFocusModeClick}
                      className={`text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-all duration-200 ${
                        isFocusTransitioning ? 'scale-110 rotate-12' : ''
                      }`}
                      title="Enter focus mode"
                    >
                      <Focus className="w-4 h-4" />
                    </button>
                  )}

                  {/* Progress bar for subtasks */}
                  <div className="w-28 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, progressPercent || 0))}%` }}
                    />
                  </div>

                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Permanently delete this task? This cannot be undone.')) {
                          onDelete(task.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {task.paid && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Paid
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>



      {/* Drag overlay - visual feedback during dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-indigo-500/10 border-2 border-indigo-500 border-dashed rounded-xl pointer-events-none" />
      )}
    </div>
  );
}