import type { DataTableProps } from './types';
import { useClientSorting } from './hooks/useClientSorting';
import { TableHeader } from './components/TableHeader';
import { TableBody } from './components/TableBody';

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
}: DataTableProps<TData>) {

  const { sortedData, sorting, sortableColumnIds, onSort, isEmptyColumns } = useClientSorting(columns, data);

  if (isEmptyColumns) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
        ❌ Error: Columns array cannot be empty
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full">
        <TableHeader
          columns={columns}
          sortableColumnIds={sortableColumnIds}
          sorting={sorting}
          onSort={onSort}
        />
        <TableBody columns={columns} data={sortedData} />
      </table>
    </div>
  );
}