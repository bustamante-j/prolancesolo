import { Task } from '@/types/task';
import { format } from 'date-fns';

export const exportToCSV = (tasks: Task[]): void => {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  // Calculate totals
  const totalEarnings = tasks.reduce((sum, task) => sum + (task.paid ? task.price : 0), 0);
  const totalHours = tasks.reduce((sum, task) => sum + task.actualHours, 0);
  const completedTasks = tasks.filter(task => task.status === 'done').length;

  // Create CSV headers
  const headers = [
    'Task Title',
    'Client',
    'Price (PHP)',
    'Hours Worked',
    'Status',
    'Paid',
    'Deadline',
    'Priority Score'
  ];

  // Create CSV rows
  const rows = tasks.map(task => [
    task.title,
    task.clientId,
    task.price.toString(),
    task.actualHours.toString(),
    task.status,
    task.paid ? 'Yes' : 'No',
    format(task.deadline, 'yyyy-MM-dd'),
    task.priorityScore.toString()
  ]);

  // Add summary rows
  rows.push([]);
  rows.push(['SUMMARY']);
  rows.push(['Total Tasks', tasks.length.toString()]);
  rows.push(['Completed Tasks', completedTasks.toString()]);
  rows.push(['Total Earnings (PHP)', totalEarnings.toString()]);
  rows.push(['Total Hours Worked', totalHours.toString()]);
  rows.push(['Average Hourly Rate', totalHours > 0 ? (totalEarnings / totalHours).toFixed(2) : '0']);

  // Convert to CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `prolance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};