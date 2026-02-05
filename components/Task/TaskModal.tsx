'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { X, Edit3, Save, Focus, Trash2 } from 'lucide-react';
import StatusDropdown from '@/components/ui/StatusDropdown';

interface Props {
  task: Task;
  onClose: () => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onFocusMode?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TaskModal({ task, onClose, onUpdate, onFocusMode, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: task.title, description: task.description || '', notes: task.notes || '' });

  const handleSave = async () => {
    if (onUpdate) await onUpdate(task.id, { ...editData });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center overflow-auto">
      <div className="mt-12 w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div>
              {isEditing ? (
                <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="text-xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none" />
              ) : (
                <h2 className="text-xl font-bold">{task.title}</h2>
              )}
              <div className="text-sm text-gray-500">{task.clientId} • ₱{task.price.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="p-2 text-green-600"><Save className="w-5 h-5" /></button>
                <button onClick={() => setIsEditing(false)} className="p-2 text-red-600"><X className="w-5 h-5" /></button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-gray-700"><Edit3 className="w-5 h-5" /></button>
                <button onClick={() => onFocusMode?.(task.id)} className="p-2 text-indigo-600 hover:text-indigo-700"><Focus className="w-5 h-5" /></button>
                <button onClick={() => { if (confirm('Delete this task permanently?')) onDelete?.(task.id); }} className="p-2 text-red-600 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
              </>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {isEditing ? (
            <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded" rows={4} />
          ) : (
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">{task.description || 'No description'}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold">Progress</h3>
            {/* subtasks and progress are handled in the tasks page focus mode; minimal here */}
            <div className="mt-2 text-sm text-gray-500">Actual: {task.actualHours}h • Estimated: {task.estimatedHours}h</div>
          </div>

          <div className="flex items-center justify-between">
            <StatusDropdown current={task.status} onChange={(s) => onUpdate?.(task.id, { status: s })} />
            <div className="space-x-2">
              <button onClick={() => onUpdate?.(task.id, { paid: !task.paid })} className={`px-3 py-1 rounded-lg ${task.paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{task.paid ? 'Paid' : 'Mark Paid'}</button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Notes</h3>
            <p className="text-gray-700 dark:text-gray-300">{task.notes || 'No notes'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
