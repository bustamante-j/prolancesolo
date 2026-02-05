'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ChartsProps {
  data: {
    earnings: { week: string; amount: number }[];
    hours: { week: string; hours: number }[];
    tasks: { week: string; count: number }[];
  };
}

export default function Charts({ data }: ChartsProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Earnings per Week
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.earnings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => [`₱${value}`, 'Earnings']} />
            <Bar dataKey="amount" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Hours Worked per Week
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.hours}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}h`, 'Hours']} />
            <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Completed Tasks per Week
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.tasks}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}`, 'Tasks']} />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}