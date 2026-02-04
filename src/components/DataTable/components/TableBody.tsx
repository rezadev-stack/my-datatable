import React from 'react';
import type { DataTableColumn } from '../types';

interface TableBodyProps<TData extends Record<string, unknown>> {
  columns: DataTableColumn<TData>[];
  data: TData[];
}

export function TableBody<TData extends Record<string, unknown>>({
  columns,
  data,
}: TableBodyProps<TData>) {
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td 
            colSpan={columns.length} 
            className="p-8 text-center text-gray-500 bg-gray-50 border-t border-gray-200"
          >
            No data available
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr 
          key={rowIndex}
          className={`
            ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            hover:bg-blue-50 transition-colors
          `}
        >
          {columns.map((column) => (
            <td
              key={`${rowIndex}-${column.id}`}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200"
            >
              {column.accessorKey ? String(row[column.accessorKey]) : ''}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}