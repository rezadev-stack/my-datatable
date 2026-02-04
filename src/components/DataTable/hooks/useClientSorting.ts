import { useState, useMemo } from 'react';
import type { DataTableColumn } from '../types';

export interface SortingState {
  id: string;
  desc: boolean;
}

export function useClientSorting<TData extends Record<string, unknown>>(
  columns: DataTableColumn<TData>[],
   data: TData[]
) {
  // ✅ Handle empty columns safely
  const isEmptyColumns = columns.length === 0;

  const [sorting, setSorting] = useState<SortingState | null>(null);

  const sortableColumnIds = useMemo(() => {
    if (isEmptyColumns) return new Set<string>();
    return new Set(
      columns
        .filter(col => col.enableSorting !== false && col.accessorKey)
        .map(col => col.id)
    );
  }, [columns, isEmptyColumns]);

  const sortedData = useMemo(() => {
    if (isEmptyColumns || !sorting) return data;
    
    const { id, desc } = sorting;
    const column = columns.find(col => col.id === id);
    
    if (!column?.accessorKey) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[column.accessorKey!];
      const bValue = b[column.accessorKey!];
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return desc ? -1 : 1;
      if (bValue == null) return desc ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return desc 
          ? bValue.localeCompare(aValue) 
          : aValue.localeCompare(bValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return desc ? bValue - aValue : aValue - bValue;
      }
      
      return desc 
        ? String(bValue).localeCompare(String(aValue))
        : String(aValue).localeCompare(String(bValue));
    });
  }, [data, sorting, columns, isEmptyColumns]);

  const handleSort = (columnId: string) => {
    if (!sortableColumnIds.has(columnId)) return;
    setSorting(prev => {
      if (!prev || prev.id !== columnId) return { id: columnId, desc: false };
      if (!prev.desc) return { id: columnId, desc: true };
      return null;
    });
  };

  return {
    sortedData,
    sorting,
    sortableColumnIds,
    onSort: handleSort,
    isEmptyColumns,
  };
}