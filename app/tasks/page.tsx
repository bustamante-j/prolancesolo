'use client';

// Main tasks page component - displays all tasks with drag-and-drop functionality
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { taskService } from '@/services/taskService';
import { clientService } from '@/services/clientService';
import { calculateDailyHours } from '@/lib/calculations';
import { auth } from '@/lib/auth';
import { Task } from '@/types/task';
import { Client } from '@/types/client';
import DraggableTaskCard from '@/components/Task/DraggableTaskCard';
import TaskModal from '@/components/Task/TaskModal';
import StatusDropdown from '@/components/ui/StatusDropdown';
import Planner from '@/components/Planner';
import { useTaskOrder } from '@/hooks/useTaskOrder';
import { useTodayFilter } from '@/hooks/useTodayFilter';
import { useFocusMode } from '@/hooks/useFocusMode';
import { Plus, AlertTriangle, Calendar, ToggleLeft, ToggleRight, Focus, EyeOff, Play, Pause, RotateCcw, CheckSquare, Square } from 'lucide-react';
import Timer from '@/components/Timer';
import CalendarComponent from '@/components/Calendar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function TasksPage() {
  // State for client data
  const [clients, setClients] = useState<Client[]>([]);
  // State for daily hours calculation
  const [dailyHours, setDailyHours] = useState(0);
  // State for hidden tasks dropdown visibility
  const [showHiddenTasks, setShowHiddenTasks] = useState(false);
  // Router for navigation
  const router = useRouter();

  // Focus mode specific state
  const [subtasks, setSubtasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  // Task expansion state
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Custom hook for task ordering and drag-and-drop functionality
  const { tasks, updateTasks, handleDragEnd, updateTask } = useTaskOrder();

  // Filter out hidden tasks for main display
  const visibleTasks = tasks.filter(task => !task.hidden);

  // Subtask progress map: taskId -> { total, completed }
  const [taskProgress, setTaskProgress] = useState<Record<string, { total: number; completed: number }>>({});

  // Custom hook for today-only filter functionality
  const { showTodayOnly, filteredTasks: todayFilteredTasks, todayCount, toggleTodayFilter } = useTodayFilter(visibleTasks);

  // Custom hook for focus mode functionality
  const { isFocusMode, focusedTaskId, filteredTasks, toggleFocusMode, exitFocusMode } = useFocusMode(todayFilteredTasks);

  // Get all hidden tasks for dropdown display
  const hiddenTasks = tasks.filter(task => task.hidden);

  // Load initial data on component mount - wait for auth state to be resolved first
  useEffect(() => {
    const unsub = auth.onAuthStateChange(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch tasks and clients data
      const tasksData = await taskService.getTasks();
      const clientsData = await clientService.getClients();
      updateTasks(tasksData);
      setClients(clientsData);
      setDailyHours(calculateDailyHours(tasksData));

      // Load subtask stats for tasks
      const stats: Record<string, { total: number; completed: number }> = {};
      await Promise.all(tasksData.map(async (t: any) => {
        const subs = await taskService.getSubtasks(t.id);
        stats[t.id] = { total: subs.length, completed: subs.filter((s: any) => s.completed).length };
      }));
      setTaskProgress(stats);
    });

    return () => unsub();
  }, [router, updateTasks]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => {
          if (time <= 1) {
            setPomodoroRunning(false);
            if (pomodoroMode === 'work') {
              setPomodoroSessions(prev => prev + 1);
              setPomodoroMode('break');
              return 5 * 60; // 5 minute break
            } else {
              setPomodoroMode('work');
              return 25 * 60; // 25 minute work session
            }
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroTime, pomodoroMode]);

  // Generic task update handler
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    await taskService.updateTask(taskId, updates);
    const tasksData = await taskService.getTasks();
    updateTasks(tasksData);
    setDailyHours(calculateDailyHours(tasksData));
  };

  // Handle task status changes (via dropdown)
  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    const prev = task?.status || 'todo';
    await taskService.updateTask(taskId, { status });
    const tasksData = await taskService.getTasks();
    updateTasks(tasksData);
    showUndo(taskId, prev);
  };

  // Hide a task (soft delete)
  const handleTaskHide = async (taskId: string) => {
    await taskService.hideTask(taskId);
    const tasksData = await taskService.getTasks();
    updateTasks(tasksData);
    setDailyHours(calculateDailyHours(tasksData));
  };

  // Restore a hidden task
  const handleTaskRestore = async (taskId: string) => {
    if (confirm('Are you sure you want to restore this task?')) {
      await taskService.updateTask(taskId, { hidden: false });
      const tasksData = await taskService.getTasks();
      updateTasks(tasksData);
      setDailyHours(calculateDailyHours(tasksData));
    }
  };

  // Update actual hours for focused task
  const handleTimeUpdate = async (hours: number) => {
    if (focusedTaskId) {
      const focusedTask = tasks.find(t => t.id === focusedTaskId);
      if (focusedTask) {
        const newActualHours = focusedTask.actualHours + hours;
        await taskService.updateTask(focusedTaskId, { actualHours: newActualHours });
        const tasksData = await taskService.getTasks();
        updateTasks(tasksData);
        setDailyHours(calculateDailyHours(tasksData));
      }
    }
  };

  // Fullscreen task modal state
  const [fullScreenTaskId, setFullScreenTaskId] = useState<string | null>(null);

  // Open fullscreen detail modal
  const openFullScreen = (taskId: string) => {
    setFullScreenTaskId(taskId);
  };
  const closeFullScreen = () => setFullScreenTaskId(null);

  // Permanently delete a task
  const handleTaskDelete = async (taskId: string) => {
    if (!confirm('Permanently delete this task? This cannot be undone.')) return;
    await taskService.deleteTask(taskId);
    const tasksData = await taskService.getTasks();
    updateTasks(tasksData);
    setDailyHours(calculateDailyHours(tasksData));
    // close modal if the deleted task was open
    if (fullScreenTaskId === taskId) setFullScreenTaskId(null);
  };

  // Handle focus mode entry
  const handleFocusMode = async (taskId: string) => {
    toggleFocusMode(taskId);
    // Load subtasks for the focused task
    const subs = await taskService.getSubtasks(taskId);
    setSubtasks(subs.map(s => ({ id: s.id, text: s.text, completed: s.completed })));
    setPomodoroTime(25 * 60);
    setPomodoroRunning(false);
    setPomodoroMode('work');
  };

  // Undo snackbar for status changes
  const [undoVisible, setUndoVisible] = useState(false);
  const [undoData, setUndoData] = useState<{ taskId: string; prevStatus: Task['status'] } | null>(null);
  const showUndo = (taskId: string, prevStatus: Task['status']) => {
    setUndoData({ taskId, prevStatus });
    setUndoVisible(true);
    setTimeout(() => setUndoVisible(false), 6000);
  };
  const undoStatus = async () => {
    if (!undoData) return;
    await taskService.updateTask(undoData.taskId, { status: undoData.prevStatus });
    const tasksData = await taskService.getTasks();
    updateTasks(tasksData);
    setUndoVisible(false);
  };

  // Pomodoro timer functions
  const startPomodoro = () => {
    setPomodoroRunning(true);
  };

  const pausePomodoro = () => {
    setPomodoroRunning(false);
  };

  const resetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroTime(pomodoroMode === 'work' ? 25 * 60 : 5 * 60);
  };

  // Add new subtask
  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask = {
        id: Date.now().toString(),
        text: newSubtask.trim(),
        completed: false
      };
      setSubtasks([...subtasks, subtask]);
      setNewSubtask('');
    }
  };

  // Toggle subtask completion
  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(subtask =>
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    ));
  };

  // Calculate subtask progress
  const subtaskProgress = subtasks.length > 0 ? (subtasks.filter(s => s.completed).length / subtasks.length) * 100 : 0;

  // Handle drag end and update database
  const onDragEnd = async (event: DragEndEvent) => {
    handleDragEnd(event);

    // After reordering, save the new order to database
    // The handleDragEnd already updated the local state with new order numbers
    // Now we need to persist this to the database
    const reorderedTasks = [...tasks];
    for (let i = 0; i < reorderedTasks.length; i++) {
      const task = reorderedTasks[i];
      if (task.order !== i) {
        await taskService.updateTask(task.id, { order: i });
      }
    }
  };

  // Redirect to login if not authenticated
  if (!auth.isAuthenticated()) return null;

  return (
    // Main page container with full height and centered content
    <div className="min-h-screen w-full px-6 md:px-8 py-6 bg-white dark:bg-gray-950 flex flex-col">
      {/* Page header with title and control buttons */}
      <div>

        {/* Control buttons - Today Only, Hidden Tasks, Focus Mode Exit */}
        <div className="flex flex-wrap gap-2 mt-6 mb-8">
          <Button variant="ghost" onClick={toggleTodayFilter} className="flex items-center gap-2 h-10">
            {showTodayOnly ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            Today Only
          </Button>

          <div className="relative">
            <Button variant="ghost" onClick={() => setShowHiddenTasks(!showHiddenTasks)} className="flex items-center gap-2 h-10">
              <EyeOff className="w-4 h-4" />
              Hidden ({hiddenTasks.length})
            </Button>

            {/* Icon-only New Task button placed next to Hidden; match height to Hidden button */}
            <Button
              variant="ghost"
              onClick={() => router.push('/add')}
              title="New Task"
              aria-label="New Task"
              className="ml-2 flex items-center gap-2 h-10"
            >
              <Plus className="w-4 h-4" />
            </Button>

            {/* Hidden Tasks Dropdown */}
            {showHiddenTasks && hiddenTasks.length > 0 && (
              <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg z-10 min-w-96 p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Restore Hidden Tasks</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {hiddenTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{task.estimatedHours}h estimate</p>
                      </div>
                      <Button variant="primary" onClick={() => handleTaskRestore(task.id)} className="ml-2 px-3 py-1 text-xs">Restore</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isFocusMode && (
            <Button variant="ghost" onClick={exitFocusMode} className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2">
              <Focus className="w-4 h-4" />
              Exit Focus
            </Button>
          )}
        </div>
      </div>

      {/* Main content - conditional rendering based on focus mode */}
      {isFocusMode ? (
        // Enhanced Focus Mode - distraction-free productivity interface
        <div className="fixed inset-0 bg-gray-900 dark:bg-black z-50 flex flex-col">
          {/* Focus Mode Header */}
          <div className="flex items-center justify-between p-6 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={exitFocusMode}
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <Focus className="w-4 h-4 mr-2" />
                Exit Focus Mode
              </button>
              <div className="text-white">
                <h2 className="text-lg font-semibold">Focus Mode</h2>
                <p className="text-sm text-gray-300">Deep work session active</p>
              </div>
            </div>

            {/* Pomodoro Timer */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-mono text-white mb-1">
                  {Math.floor(pomodoroTime / 60).toString().padStart(2, '0')}:{(pomodoroTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-300">
                  {pomodoroMode === 'work' ? 'Work Session' : 'Break Time'} • {pomodoroSessions} completed
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={pomodoroRunning ? pausePomodoro : startPomodoro}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  {pomodoroRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={resetPomodoro}
                  className="p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Focus Content */}
          <div className="flex-1 flex">
            {/* Left Side - Detailed Task View */}
            <div className="flex-1 p-8">
              {filteredTasks.map((task) => (
                <div key={task.id} className="max-w-4xl mx-auto">
                  {/* Task Header */}
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">{task.title}</h1>
                    <div className="flex items-center space-x-6 text-gray-300 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">Client: {task.clientId}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Price: ₱{task.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Estimated: {task.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Actual: {task.actualHours.toFixed(1)}h</span>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-xl text-gray-200 leading-relaxed">{task.description}</p>
                    )}
                  </div>

                  {/* Progress Section */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-4">Progress</h3>
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white font-medium">Subtasks Completed</span>
                        <span className="text-gray-300">{subtasks.filter(s => s.completed).length} / {subtasks.length} ({subtasks.length > 0 ? Math.round((subtasks.filter(s => s.completed).length / subtasks.length) * 100) : 0}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                        <div
                          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${subtasks.length > 0 ? Math.round((subtasks.filter(s => s.completed).length / subtasks.length) * 100) : 0}%` }}
                        ></div>
                      </div>

                      {/* Add New Subtask */}
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                          placeholder="Add a subtask..."
                          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={addSubtask}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      {/* Subtasks List - scrollable to avoid footer clipping */}
                      <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar p-1">
                        {subtasks.map((subtask) => (
                          <div
                            key={subtask.id}
                            className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
                          >
                            <button
                              onClick={() => toggleSubtask(subtask.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                subtask.completed
                                  ? 'bg-green-600 border-green-600 text-white'
                                  : 'border-gray-500 hover:border-gray-400'
                              }`}
                            >
                              {subtask.completed && <CheckSquare className="w-3 h-3" />}
                            </button>
                            <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                              {subtask.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {task.notes && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-white mb-4">Notes</h3>
                      <div className="bg-gray-800 rounded-lg p-6">
                        <p className="text-gray-200 whitespace-pre-wrap">{task.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side - Minimal Timer & Stats */}
            <div className="w-80 bg-gray-800 dark:bg-gray-900 p-6 border-l border-gray-700">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Session Stats</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-indigo-400">{pomodoroSessions}</div>
                    <div className="text-sm text-gray-300">Pomodoros Completed</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{subtasks.filter(s => s.completed).length}</div>
                    <div className="text-sm text-gray-300">Subtasks Done</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{Math.floor(pomodoroTime / 60)}:{(pomodoroTime % 60).toString().padStart(2, '0')}</div>
                    <div className="text-sm text-gray-300">Time Remaining</div>
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="text-center">
                <p className="text-gray-300 italic">
                  {pomodoroMode === 'work'
                    ? "Stay focused. You've got this! 💪"
                    : "Great work! Take a well-deserved break. ☕"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Regular Tasks View
        <>
          {/* Fullscreen Task Modal */}
          {fullScreenTaskId && (
            <TaskModal
              task={tasks.find(t => t.id === fullScreenTaskId)!}
              onClose={closeFullScreen}
              onUpdate={handleTaskUpdate}
              onFocusMode={handleFocusMode}
              onDelete={handleTaskDelete}
            />
          )}

          {/* Undo snackbar for status changes */}
          {undoVisible && (
            <div className="fixed left-6 bottom-6 bg-gray-900 dark:bg-gray-950 text-white px-6 py-4 rounded-xl shadow-xl z-50 inline-flex items-center gap-4 border border-gray-700 dark:border-gray-800">
              <span className="font-medium">Status updated</span>
              <button onClick={undoStatus} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold underline">Undo</button>
            </div>
          )}
          {/* Overwork Warning Banner - appears when daily hours exceed 8 */}
          {dailyHours > 8 && (
            <Card className="mb-6 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-3 p-4">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-300">You've worked {dailyHours.toFixed(1)} hours today</p>
                  <p className="text-sm text-red-800 dark:text-red-400">Take a break to recharge!</p>
                </div>
              </div>
            </Card>
          )}

          {/* Main content grid - 70/30 split on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left column - tasks list (8/12 width on large screens, 8/12 on medium) */}
            <div className="lg:col-span-8 md:col-span-8 pr-6 lg:pr-8">
          {filteredTasks.length > 0 ? (
            // Drag and drop context for task reordering
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={filteredTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {/* Task cards - responsive layout */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredTasks.map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onHide={handleTaskHide}
                      onFocusMode={handleFocusMode}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                      onOpenFullScreen={openFullScreen}
                      isFocused={isFocusMode && task.id === focusedTaskId}
                      progressPercent={taskProgress[task.id] ? Math.round((taskProgress[task.id].completed / Math.max(1, taskProgress[task.id].total)) * 100) : 0}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            // Empty state when no tasks match current filters
            <div className="col-span-full text-center py-16">
              {showTodayOnly ? (
                // No tasks due today message
                <div className="space-y-4">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 text-lg font-medium mb-2">No tasks due today</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Great job staying on top of your work! 🎉
                    </p>
                    <Button variant="ghost" onClick={toggleTodayFilter}>View all tasks</Button>
                  </div>
                </div>
              ) : isFocusMode ? (
                // Focus mode empty state
                <div className="space-y-4">
                  <Focus className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 text-lg font-medium mb-2">Focus mode active</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Click a task to focus on it
                    </p>
                    <Button variant="ghost" onClick={exitFocusMode}>Exit focus mode</Button>
                  </div>
                </div>
              ) : (
                // General empty state when no tasks exist
                <div className="space-y-4">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks yet — create one to get started!</p>
                  <Button onClick={() => router.push('/add')}>Create first task</Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column - Calendar above Planner on large screens */}
        <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-gray-200 lg:dark:border-gray-800 lg:pl-6">
          <div className="hidden lg:block">
            <div className="mb-4">
              <CalendarComponent tasks={tasks} />
            </div>
            <div>
              <Planner tasks={filteredTasks} clients={clients} />
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}