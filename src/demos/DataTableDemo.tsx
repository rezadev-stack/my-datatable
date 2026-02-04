import React from 'react';
import { DataTable } from '../components/DataTable/DataTable';
import type { DataTableColumn } from '../components/DataTable/types';

// Sample data types
type Employee = {
  id: number;
  name: string;
  email: string;
  age: number;
  salary: number;
  department: string;
};

// Mock data
const mockEmployees: Employee[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, salary: 75000, department: 'Engineering' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, salary: 62000, department: 'Marketing' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', age: 35, salary: 95000, department: 'Sales' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', age: 28, salary: 58000, department: 'HR' },
  { id: 5, name: 'Michael Wilson', email: 'michael@example.com', age: 40, salary: 110000, department: 'Engineering' },
  { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', age: 32, salary: 82000, department: 'Finance' },
  { id: 7, name: 'David Miller', email: 'david@example.com', age: 29, salary: 71000, department: 'Marketing' },
  { id: 8, name: 'Lisa Taylor', email: 'lisa@example.com', age: 33, salary: 88000, department: 'Engineering' },
];

// Column definitions
const columns: DataTableColumn<Employee>[] = [
  { id: 'id', header: 'ID', accessorKey: 'id' },
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'email', header: 'Email', accessorKey: 'email' },
  { id: 'age', header: 'Age', accessorKey: 'age' },
  { id: 'salary', header: 'Salary', accessorKey: 'salary' },
  { id: 'department', header: 'Department', accessorKey: 'department' },
];

export function DataTableDemo() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">DataTable Demo - Step 1</h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="font-medium text-blue-800 mb-2">✅ Step 1 Complete:</h2>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Basic table rendering with headers</li>
          <li>• Type-safe generic data support</li>
          <li>• Empty state handling</li>
          <li>• Hover effects and clean Tailwind styling</li>
          <li>• Error handling for empty columns</li>
        </ul>
      </div>
      
      {/* Working table with real data */}
      <DataTable<Employee>
        columns={columns}
        data={mockEmployees}
      />
      
      {/* Test cases below the main table */}
      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Test Case: Empty Data</h2>
          <DataTable<Employee>
            columns={columns}
            data={[]}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Test Case: Single Row</h2>
          <DataTable<Employee>
            columns={columns}
            data={[mockEmployees[0]]}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Test Case: Missing accessorKey</h2>
          <DataTable<{ name: string }>
            columns={[
              { id: 'name', header: 'Name', accessorKey: 'name' },
              { id: 'empty', header: 'Empty Column' }, // No accessorKey
            ]}
            data={[{ name: 'Test User' }]}
          />
        </div>
      </div>
    </div>
  );
}