import React from 'react';
import type { DataTableProps } from './types';

/**
 * DataTable Component - Step 1.5
 * 
 * Enhanced with alternating row colors for improved readability.
 * This is the foundation. Features like sorting, pagination, and
 * row selection will be added incrementally in future steps.
 * 
 * @param props.columns - Column definitions
 * @param props.data - Data array to render
 * @returns JSX table element
 */
export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
}: DataTableProps<TData>) {
  // Validation: Ensure columns array is not empty
  if (columns.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
        ❌ Error: Columns array cannot be empty
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`
                px-6 py-4 whitespace-nowrap
                ${rowIndex % 2 === 0 
                  ? 'bg-white' 
                  : 'bg-gray-50'
                }
                hover:bg-blue-50 transition-colors
              `}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.id}`}
                  className="px-6 py-4 text-sm text-gray-900"
                >
                  {column.accessorKey ? String(row[column.accessorKey]) : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-gray-50 border-t border-gray-200">
          No data available
        </div>
      )}
    </div>
  );
}