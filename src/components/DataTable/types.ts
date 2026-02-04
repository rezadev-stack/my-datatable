/**
 * Core type definitions for DataTable component
 * 
 * These types ensure type safety while allowing flexible API data shapes.
 * TData is generic to accept any data structure from APIs.
 */

export interface DataTableColumn<TData extends Record<string, unknown>> {
  /**
   * Unique identifier for the column
   * Used for key props and internal tracking
   */
  id: string;
  
  /**
   * Display text for the column header
   */
  header: string;
  
  /**
   * Key to access data from row object
   * Optional - if not provided, column won't display cell data
   */
  accessorKey?: keyof TData;
  
  /**
   * Enable sorting for this column
   * @default true
   */
  enableSorting?: boolean;
}

export interface DataTableProps<TData extends Record<string, unknown>> {
  /**
   * Array of column definitions
   * Defines table structure and data mapping
   */
  columns: DataTableColumn<TData>[];
  
  /**
   * Data to display in the table
   * Must be an array of objects matching TData shape
   */
   data: TData[];
  
  /**
   * Enable client-side sorting
   * @default false
   */
  enableSorting?: boolean;
}