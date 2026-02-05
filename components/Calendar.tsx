'use client';

// Calendar component for displaying monthly view with task deadline highlighting
// Shows current month with visual indicators for days that have task deadlines

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Task } from '@/types/task';

interface CalendarProps {
  tasks: Task[];
}

export default function Calendar({ tasks }: CalendarProps) {
  // State for the currently displayed month
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate calendar boundaries for the current month view
  // Includes padding days from previous/next month to fill the grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate array of all dates to display in the calendar grid
  const days = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Extract unique deadline dates for tasks in the current month (excluding hidden tasks)
  const deadlineDays = tasks
    .filter(task => !task.hidden)
    .map(task => task.deadline)
    .filter(date => isSameMonth(date, currentDate))
    .map(date => format(date, 'yyyy-MM-dd'));

  // Helper function to check if a date has any task deadlines
  const hasDeadline = (date: Date) => {
    return deadlineDays.includes(format(date, 'yyyy-MM-dd'));
  };

  return (
    // Calendar container with responsive styling
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {/* Month/Year Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - displays all days with conditional styling */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          // Determine styling based on date properties
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);
          const hasTaskDeadline = hasDeadline(date);

          return (
            <div
              key={index}
              className={`
                text-center text-sm py-2 px-1 rounded-md transition-colors
                ${!isCurrentMonth
                  ? 'text-gray-300 dark:text-gray-600'  // Faded for days outside current month
                  : isTodayDate
                  ? 'bg-blue-600 text-white font-semibold'  // Highlighted blue for today
                  : hasTaskDeadline
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium'  // Green for deadline days
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'  // Default styling with hover
                }
              `}
            >
              {format(date, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}