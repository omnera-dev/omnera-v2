# TanStack Table - Headless Table Library

> **Note**: This is part 16 of the split documentation. See navigation links below.

## Reusable Data Table Component (shadcn/ui Pattern)

Create a reusable data table component following shadcn/ui conventions:

```typescript
// src/components/ui/data-table.tsx
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from '@/lib/utils'
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  pagination?: boolean
  sorting?: boolean
  filtering?: boolean
}
export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pagination = true,
  sorting = true,
  filtering = true,
}: DataTableProps<TData, TValue>) {
  const [sortingState, setSortingState] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sortingState,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: sorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: filtering ? getFilteredRowModel() : undefined,
    enableRowSelection: true,
    enableMultiRowSelection: true,
  })
  return (
    <div className="space-y-4">
      {/* Search Input */}
      {searchKey && filtering && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Search ${searchKey}...`}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
            className="max-w-sm rounded border px-3 py-2"
          />
        </div>
      )}
      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="min-w-full divide-y">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y bg-background">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="transition-colors hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                'rounded border px-3 py-1',
                !table.getCanPreviousPage() && 'cursor-not-allowed opacity-50'
              )}
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                'rounded border px-3 py-1',
                !table.getCanNextPage() && 'cursor-not-allowed opacity-50'
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Usage

```typescript
// Usage in application
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
}
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]
function UsersPage() {
  const [users] = useState<User[]>([
    { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', status: 'inactive' },
  ])
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Users</h1>
      <DataTable columns={columns} data={users} searchKey="name" />
    </div>
  )
}
```

---

## Navigation

[← Part 15](./15-styling-with-tailwind-css.md) | [Part 17 →](./17-performance-optimization.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-table-for-omnera.md) | [Part 4](./04-core-concepts.md) | [Part 5](./05-installation.md) | [Part 6](./06-basic-table-setup.md) | [Part 7](./07-column-definitions.md) | [Part 8](./08-sorting.md) | [Part 9](./09-filtering.md) | [Part 10](./10-pagination.md) | [Part 11](./11-row-selection.md) | [Part 12](./12-column-visibility.md) | [Part 13](./13-integration-with-tanstack-query.md) | [Part 14](./14-integration-with-effectts.md) | [Part 15](./15-styling-with-tailwind-css.md) | **Part 16** | [Part 17](./17-performance-optimization.md) | [Part 18](./18-testing.md) | [Part 19](./19-best-practices.md) | [Part 20](./20-common-pitfalls.md) | [Part 21](./21-when-to-use-tanstack-table.md) | [Part 22](./22-full-stack-integration-with-layered-architecture.md) | [Part 23](./23-references.md)
