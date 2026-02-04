// src/components/DataTable/config-merger.ts
import type { 
  DataTableColumn, 
  DataTablePresentationConfig,
  ConfigMergeLayers 
} from './types';

/**
 * MERGES THREE CONFIG LAYERS WITH STRICT PRIORITY:
 * userOverrides > apiConfig > devDefaults
 * 
 * SECURITY: Respects `alwaysVisible` columns from column definitions
 * PERFORMANCE: Pure function (no side effects) - safe for memoization
 * DEBUGGABLE: Returns merge metadata for dev tools
 */
export function mergePresentationConfig<TData extends object>(
  layers: ConfigMergeLayers<TData>,
  columns: DataTableColumn<TData>[]
): {
  merged: DataTablePresentationConfig<TData>;
  meta: {  // ← FIXED: Added colon after 'meta'
    source: 'user' | 'api' | 'default';
    overriddenKeys: string[];
    hiddenAlwaysVisibleColumns: string[];
  };
} {
  const { devDefaults, apiConfig, userOverrides } = layers;
  
  // Track which keys were overridden for debugging
  const overriddenKeys: string[] = [];
  
  // Helper to safely merge a single property
  const mergeProperty = <K extends keyof DataTablePresentationConfig>(
    key: K,
    defaultValue: DataTablePresentationConfig<TData>[K],
    apiValue?: DataTablePresentationConfig<TData>[K],
    userValue?: DataTablePresentationConfig<TData>[K]
  ): DataTablePresentationConfig<TData>[K] => {
    // User override has highest priority
    if (userValue !== undefined && userValue !== null) {
      if (apiValue !== undefined && apiValue !== userValue) overriddenKeys.push(key);
      if (defaultValue !== undefined && defaultValue !== userValue) overriddenKeys.push(key);
      return userValue;
    }
    
    // API config second
    if (apiValue !== undefined && apiValue !== null) {
      if (defaultValue !== undefined && defaultValue !== apiValue) overriddenKeys.push(key);
      return apiValue;
    }
    
    // Dev defaults last
    return defaultValue;
  };

  // Merge each configurable property
  const merged: DataTablePresentationConfig<TData> = {
    visibleColumns: mergeProperty(
      'visibleColumns',
      devDefaults.visibleColumns,
      apiConfig?.visibleColumns,
      userOverrides?.visibleColumns
    ),
    rowStyleRules: mergeProperty(
      'rowStyleRules',
      devDefaults.rowStyleRules,
      apiConfig?.rowStyleRules,
      userOverrides?.rowStyleRules
    ),
    cellStyleRules: mergeProperty(
      'cellStyleRules',
      devDefaults.cellStyleRules,
      apiConfig?.cellStyleRules,
      userOverrides?.cellStyleRules
    ),
    columnOrder: mergeProperty(
      'columnOrder',
      devDefaults.columnOrder,
      apiConfig?.columnOrder,
      userOverrides?.columnOrder
    ),
    defaultSorting: mergeProperty(
      'defaultSorting',
      devDefaults.defaultSorting,
      apiConfig?.defaultSorting,
      userOverrides?.defaultSorting
    ),
    defaultPageSize: mergeProperty(
      'defaultPageSize',
      devDefaults.defaultPageSize,
      apiConfig?.defaultPageSize,
      userOverrides?.defaultPageSize
    ),
  };

  // SECURITY PASS: Enforce alwaysVisible columns
  const alwaysVisibleKeys = columns
    .filter(col => col.alwaysVisible)
    .map(col => String(col.accessorKey));
  
  let hiddenAlwaysVisibleColumns: string[] = [];
  
  if (merged.visibleColumns) {
    // Add missing alwaysVisible columns
    const missingAlwaysVisible = alwaysVisibleKeys.filter(
      key => !merged.visibleColumns!.includes(key)
    );
    
    if (missingAlwaysVisible.length > 0) {
      // Prepend to preserve order intention (user/API hid them accidentally)
      merged.visibleColumns = [...missingAlwaysVisible, ...merged.visibleColumns];
      hiddenAlwaysVisibleColumns = missingAlwaysVisible;
    }
    
    // Remove duplicates while preserving order
    merged.visibleColumns = [...new Set(merged.visibleColumns)];
  }

  // Determine primary source for debugging
  const source = userOverrides ? 'user' : (apiConfig ? 'api' : 'default');

  return {
    merged,
    meta: {  // ← FIXED: Added colon after 'meta'
      source,
      overriddenKeys: [...new Set(overriddenKeys)],
      hiddenAlwaysVisibleColumns
    }
  };
}

/**
 * FILTERS COLUMNS BASED ON MERGED VISIBLE COLUMNS
 * Respects alwaysVisible security constraint
 */
export function applyVisibilityRules<TData extends object>(
  allColumns: DataTableColumn<TData>[],
  visibleColumnIds: string[]
): DataTableColumn<TData>[] {
  return allColumns.filter(col => {
    const key = String(col.accessorKey);
    // Always visible columns bypass visibility check
    if (col.alwaysVisible) return true;
    return visibleColumnIds.includes(key);
  });
}