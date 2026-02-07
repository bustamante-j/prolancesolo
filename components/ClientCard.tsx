'use client';

import { Client } from '@/types/client';
import { Star } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
}

export default function ClientCard({ client, onEdit }: ClientCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{client.name}</h3>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < client.importance
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">{client.notes}</p>

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          client.paymentBehavior === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
          client.paymentBehavior === 'good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
          client.paymentBehavior === 'average' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {client.paymentBehavior.charAt(0).toUpperCase() + client.paymentBehavior.slice(1)} Payer
        </span>
        {onEdit && (
          <button
            onClick={() => onEdit(client)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}