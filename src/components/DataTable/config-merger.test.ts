// // src/components/DataTable/config-merger.test.ts
// import { mergePresentationConfig, applyVisibilityRules } from './config-merger';
// import type { DataTableColumn } from './types';

// describe('mergePresentationConfig', () => {
//   type User = { id: number; name: string; salary: number; ssn: string };
  
//   const COLUMNS: DataTableColumn<User>[] = [
//     { accessorKey: 'id', alwaysVisible: true },
//     { accessorKey: 'name' },
//     { accessorKey: 'salary' },
//     { accessorKey: 'ssn', alwaysVisible: true } // Sensitive field
//   ];

//   it('user overrides > api config > dev defaults (visibleColumns)', () => {
//     const result = mergePresentationConfig(
//       {
//         devDefaults: { visibleColumns: ['id', 'name', 'salary', 'ssn'] },
//         apiConfig: { visibleColumns: ['id', 'name'] }, // API hides salary/ssn
//         userOverrides: { visibleColumns: ['id', 'salary'] } // User re-shows salary
//       },
//       COLUMNS
//     );
    
//     // User preference wins, but alwaysVisible columns are enforced
//     expect(result.merged.visibleColumns).toEqual(['id', 'ssn', 'salary']);
//     expect(result.meta.source).toBe('user'); // ← FIXED: meta (not metadata)
//     expect(result.meta.overriddenKeys).toContain('visibleColumns'); // ← FIXED
//     // ssn was hidden by API but enforced by alwaysVisible
//     expect(result.meta.hiddenAlwaysVisibleColumns).toEqual(['ssn']); // ← FIXED
//   });

//   it('alwaysVisible columns cannot be hidden (security test)', () => {
//     const result = mergePresentationConfig(
//       {
//         devDefaults: { visibleColumns: ['id', 'name'] },
//         userOverrides: { visibleColumns: ['name'] } // User tries to hide ID
//       },
//       COLUMNS
//     );
    
//     // ID and SSN remain visible despite user request
//     expect(result.merged.visibleColumns).toEqual(['id', 'ssn', 'name']);
//     expect(result.meta.hiddenAlwaysVisibleColumns).toEqual(['id', 'ssn']); // ← FIXED
//   });

//   it('preserves rule arrays without mutation', () => {
//     const apiRules = [{ id: 'rule1', condition: () => true, className: 'bg-red' }];
//     const userRules = [{ id: 'rule2', condition: () => false, className: 'bg-blue' }];
    
//     const result = mergePresentationConfig(
//       {
//         devDefaults: { rowStyleRules: [] },
//         apiConfig: { rowStyleRules: apiRules },
//         userOverrides: { rowStyleRules: userRules }
//       },
//       COLUMNS
//     );
    
//     expect(result.merged.rowStyleRules).toBe(userRules); // Reference equality
//     expect(result.merged.rowStyleRules).toHaveLength(1);
//     expect(result.merged.rowStyleRules![0].id).toBe('rule2');
//   });

//   it('handles null/undefined layers gracefully', () => {
//     const result = mergePresentationConfig(
//       {
//         devDefaults: { visibleColumns: ['id', 'name'], defaultPageSize: 10 },
//         apiConfig: null,
//         userOverrides: undefined
//       },
//       COLUMNS
//     );
    
//     expect(result.merged.visibleColumns).toEqual(['id', 'ssn', 'name']); // alwaysVisible enforced
//     expect(result.merged.defaultPageSize).toBe(10);
//     expect(result.meta.source).toBe('default'); // ← FIXED
//   });

//   it('removes duplicate column IDs while preserving order', () => {
//     const result = mergePresentationConfig(
//       {
//         devDefaults: { visibleColumns: ['id', 'name'] },
//         userOverrides: { visibleColumns: ['id', 'name', 'id', 'salary'] }
//       },
//       COLUMNS
//     );
    
//     expect(result.merged.visibleColumns).toEqual(['id', 'ssn', 'name', 'salary']);
//   });
// });

// describe('applyVisibilityRules', () => {
//   type Product = { sku: string; name: string; cost: number };
  
//   const ALL_COLUMNS: DataTableColumn<Product>[] = [
//     { accessorKey: 'sku', alwaysVisible: true },
//     { accessorKey: 'name' },
//     { accessorKey: 'cost' }
//   ];

//   it('filters columns to only visible ones', () => {
//     const visible = applyVisibilityRules(ALL_COLUMNS, ['sku', 'cost']);
//     expect(visible.map(c => c.accessorKey)).toEqual(['sku', 'cost']);
//   });

//   it('alwaysVisible columns appear even if not in visible list', () => {
//     const visible = applyVisibilityRules(ALL_COLUMNS, ['name']);
//     // sku is alwaysVisible → appears even though not in visible list
//     expect(visible.map(c => c.accessorKey)).toEqual(['sku', 'name']);
//   });

//   it('preserves original column order from allColumns', () => {
//     const visible = applyVisibilityRules(ALL_COLUMNS, ['cost', 'sku']);
//     // Order follows ALL_COLUMNS definition, not visible list order
//     expect(visible.map(c => c.accessorKey)).toEqual(['sku', 'cost']);
//   });
// });