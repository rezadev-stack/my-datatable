import React from 'react';
import type { DataTableColumn } from '../types';
import { SortIndicator } from './SortIndicator';

interface TableHeaderProps<TData extends Record<string, unknown>> {
  columns: DataTableColumn<TData>[];
  sortableColumnIds: Set<string>;
  sorting: { id: string; desc: boolean } | null;
  onSort: (columnId: string) => void;
}

export function TableHeader<TData extends Record<string, unknown>>({
  columns,
  sortableColumnIds,
  sorting,
  onSort,
}: TableHeaderProps<TData>) {
  return (
    <thead>
      <tr className="bg-gray-800 text-white">
        {columns.map((column) => {
          const isSortable = sortableColumnIds.has(column.id);
          const isSorted = sorting?.id === column.id;
          const isDesc = isSorted && sorting.desc;
          
          return (
            <th
              key={column.id}
              onClick={() => isSortable && onSort(column.id)}
              className={`
                px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                ${isSortable ? 'cursor-pointer hover:bg-gray-700 transition-colors' : ''}
                ${isSorted ? 'bg-gray-900' : ''}
                border-r border-gray-700 last:border-r-0
              `}
              aria-sort={
                isSorted 
                  ? (isDesc ? 'descending' : 'ascending')
                  : undefined
              }
            >
              <div className="flex items-center">
                {column.header}
                {isSortable && (
                  <SortIndicator isSorted={isSorted} isDesc={!!isDesc} />
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}