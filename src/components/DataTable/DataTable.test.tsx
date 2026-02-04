import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';
import type { DataTableProps } from './types';

/**
 * DataTable Component Tests - Step 1
 * 
 * These tests validate the minimal table shell implementation.
 * Only tests what exists in Step 1 - no future features.
 */

// Helper to create valid props with proper type constraints
function createProps<T extends Record<string, unknown>>(
  overrides?: Partial<DataTableProps<T>>
): DataTableProps<T> {
  return {
    columns: [
      { id: 'name', header: 'Name', accessorKey: 'name' as keyof T },
      { id: 'age', header: 'Age', accessorKey: 'age' as keyof T },
    ],
    data: [] as T[],
    ...overrides,
  };
}

describe('DataTable - Step 1: Minimal Shell', () => {
  
  describe('Rendering', () => {
    test('renders table element', () => {
      const props = createProps<{ name: string; age: number }>();
      render(<DataTable {...props} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    test('renders correct number of headers based on columns prop', () => {
      const props = createProps<{ name: string; age: number }>();
      render(<DataTable {...props} />);
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(props.columns.length);
      expect(headers[0]).toHaveTextContent('Name');
      expect(headers[1]).toHaveTextContent('Age');
    });

    test('renders correct number of rows based on data prop', () => {
      type RowType = { name: string; age: number };
      const data: RowType[] = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
        { name: 'Bob', age: 35 },
      ];
      
      const props = createProps<RowType>({ data });
      render(<DataTable {...props} />);
      
      const rows = screen.getAllByRole('row');
      // +1 for header row
      expect(rows).toHaveLength(data.length + 1);
    });

    test('displays cell data from accessorKey', () => {
      type RowType = { name: string; age: number };
      const data: RowType[] = [
        { name: 'Alice', age: 28 },
        { name: 'Charlie', age: 40 },
      ];
      
      const props = createProps<RowType>({ data });
      render(<DataTable {...props} />);
      
      // Check first row cells
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
      
      // Check second row cells
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
    });

    test('renders empty cells when accessorKey is not provided', () => {
      type RowType = { name: string };
      const props: DataTableProps<RowType> = createProps<RowType>({
        columns: [
          { id: 'name', header: 'Name', accessorKey: 'name' },
          { id: 'empty', header: 'Empty Column' }, // No accessorKey
        ],
        data: [{ name: 'Test' }],
      });
      
      render(<DataTable {...props} />);
      
      // Name cell has content
      expect(screen.getByText('Test')).toBeInTheDocument();
      
      // Empty column cell exists
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    test('shows error message when columns array is empty', () => {
      render(<DataTable columns={[]} data={[]} />);
      
      expect(
        screen.getByText(/Invalid table configuration: No columns defined/i)
      ).toBeInTheDocument();
    });

    test('does not crash when data array is empty', () => {
      const props = createProps<{ name: string; age: number }>({ data: [] });
      render(<DataTable {...props} />);
      
      // Table renders with headers but no data rows
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(1); // Only header row
    });
  });

  describe('Accessibility', () => {
    test('renders table with proper semantic structure', () => {
      type RowType = { name: string; age: number };
      const props = createProps<RowType>({ data: [{ name: 'Test', age: 30 }] });
      
      render(<DataTable {...props} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Age' })).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(2); // Header + 1 data row
    });

    test('each row has correct number of cells', () => {
      type RowType = { name: string; age: number };
      const data: RowType[] = [
        { name: 'Row 1', age: 10 },
        { name: 'Row 2', age: 20 },
      ];
      
      const props = createProps<RowType>({ data });
      render(<DataTable {...props} />);
      
      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1); // Skip header row
      
      dataRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        expect(cells.length).toBe(2); // Matches column count
      });
    });
  });
});