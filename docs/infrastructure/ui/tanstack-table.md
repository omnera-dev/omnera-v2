# TanStack Table - Headless Table Library

## Overview

**Version**: Latest (^8.20.5)
**Purpose**: Framework-agnostic headless table library for building powerful data tables and data grids with complete control over markup and styling

TanStack Table (formerly React Table) is a headless UI library for building feature-rich data tables. Unlike traditional component libraries that provide pre-styled tables, TanStack Table focuses solely on state management and table logic, giving you 100% control over markup, styling, and rendering.

## Why TanStack Table for Omnera?

### Perfect Fit for Our Stack

- **Headless Architecture**: Integrates seamlessly with Tailwind CSS and shadcn/ui's design philosophy
- **TypeScript First**: Fully typed API with excellent inference and autocomplete
- **React 19 Compatible**: Works perfectly with modern React patterns and hooks
- **Composable**: Build complex tables from simple, reusable pieces
- **Performance**: Optimized for large datasets with virtualization support
- **Feature-Rich**: Sorting, filtering, pagination, row selection, and more built-in
- **Framework Agnostic**: Core logic works across frameworks (React, Vue, Solid, etc.)

### Benefits for Omnera

1. **Design Freedom**: Build tables that perfectly match shadcn/ui aesthetic
2. **Type Safety**: Full TypeScript support with generic type inference
3. **Composability**: Aligns with FP principles—compose features declaratively
4. **Performance**: Handle large datasets efficiently with virtualization
5. **Maintainability**: Separate table logic from presentation concerns
6. **Flexibility**: Adapt to any design requirement without fighting library constraints

## Core Concepts

### 1. Headless UI Philosophy

TanStack Table doesn't render any DOM elements. Instead, it provides:

- **State management** for table features (sorting, filtering, pagination)
- **API methods** to interact with table state
- **Computed values** for rendering (rows, columns, headers)

**You control**:
- HTML markup structure
- CSS styling (with Tailwind CSS)
- Component architecture
- Event handlers
- Accessibility attributes

```typescript
// ❌ Traditional component library
<DataTable data={data} columns={columns} /> // Fixed markup, limited customization

// ✅ TanStack Table (headless)
const table = useReactTable({ data, columns })
<table>
  <thead>
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <th key={header.id}>{/* Custom markup */}</th>
        ))}
      </tr>
    ))}
  </thead>
  {/* Full control over rendering */}
</table>
```

### 2. Table Instance

The table instance is the central object containing all state and APIs:

```typescript
import { useReactTable } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  // Feature options
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

// Access state
table.getState() // { sorting: [], pagination: { pageIndex: 0, pageSize: 10 } }

// Access APIs
table.getRowModel().rows // Get current rows
table.getAllColumns() // Get all columns
table.getHeaderGroups() // Get header groups for rendering
```

### 3. Column Definitions

Columns define how data is accessed, displayed, and interacted with:

```typescript
import { ColumnDef } from '@tanstack/react-table'

interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name', // Access data by key
    header: 'Name', // Header text
    cell: (info) => info.getValue(), // Custom cell rendering
  },
  {
    accessorFn: (row) => row.email, // Access with function
    id: 'email',
    header: 'Email',
  },
  {
    id: 'actions', // Display column (no data)
    header: 'Actions',
    cell: (props) => <button>Delete</button>,
  },
]
```

### 4. Data Model

Data must be an array of objects with stable references:

```typescript
// ✅ CORRECT: Stable reference with useState or useMemo
const [data, setData] = useState<User[]>([
  { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
  { id: 2, name: 'Bob', email: 'bob@example.com', status: 'inactive' },
])

// ✅ CORRECT: Stable reference with useMemo
const data = useMemo(
  () => [
    { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', status: 'inactive' },
  ],
  []
)

// ❌ INCORRECT: New reference on every render
const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
] // Will cause infinite re-renders!
```

### 5. Row Model

TanStack Table uses "row models" to process data:

- **Core Row Model**: Base rows from your data (always required)
- **Sorted Row Model**: Rows after sorting
- **Filtered Row Model**: Rows after filtering
- **Paginated Row Model**: Current page rows
- **Grouped Row Model**: Rows after grouping

```typescript
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(), // Required
  getSortedRowModel: getSortedRowModel(), // Enable sorting
  getFilteredRowModel: getFilteredRowModel(), // Enable filtering
  getPaginationRowModel: getPaginationRowModel(), // Enable pagination
})
```

## Installation

TanStack Table is already set up in Omnera. If adding to a new project:

```bash
bun add @tanstack/react-table
```

**Key Dependencies**:
- `@tanstack/react-table` - React adapter for TanStack Table
- `@tanstack/react-query` - Optional, for server-side data fetching
- `@tanstack/react-virtual` - Optional, for virtualization

## Basic Table Setup

### Minimal Example

```typescript
import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

interface User {
  id: number
  name: string
  email: string
}

function UserTable() {
  // Stable data reference
  const [data] = useState<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  ])

  // Memoized column definitions
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
      },
    ],
    []
  )

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="whitespace-nowrap px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### Key Components

1. **flexRender**: Utility to render cells/headers (supports JSX, strings, or functions)
2. **getHeaderGroups()**: Returns header rows (supports nested headers)
3. **getRowModel().rows**: Returns current rows (after sorting, filtering, pagination)
4. **getVisibleCells()**: Returns cells respecting column visibility

## Column Definitions

### Column Types

**1. Accessor Columns** - Columns with underlying data:

```typescript
// Using accessorKey (string path)
{
  accessorKey: 'email',
  header: 'Email',
}

// Using accessorFn (custom function)
{
  accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
}
```

**2. Display Columns** - Columns without data (actions, checkboxes):

```typescript
{
  id: 'actions',
  header: 'Actions',
  cell: (props) => (
    <button onClick={() => deleteUser(props.row.original)}>
      Delete
    </button>
  ),
}
```

**3. Grouping Columns** - Organize other columns:

```typescript
{
  id: 'name',
  header: 'Name',
  columns: [
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ],
}
```

### Column Helper

Type-safe column creation:

```typescript
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<User>()

const columns = [
  // Accessor column
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),

  // Accessor with function
  columnHelper.accessor((row) => row.email.toLowerCase(), {
    id: 'email',
    header: 'Email',
  }),

  // Display column
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (props) => <ActionsMenu row={props.row} />,
  }),

  // Grouping column
  columnHelper.group({
    id: 'info',
    header: 'User Information',
    columns: [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('email', { header: 'Email' }),
    ],
  }),
]
```

### Custom Cell Rendering

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue<'active' | 'inactive'>()
      return (
        <span
          className={cn(
            'rounded-full px-2 py-1 text-xs font-medium',
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          )}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: (info) => {
      const date = info.getValue<Date>()
      return new Intl.DateTimeFormat('en-US').format(date)
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (props) => {
      const user = props.row.original
      return (
        <div className="flex gap-2">
          <button
            onClick={() => editUser(user)}
            className="text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => deleteUser(user)}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      )
    },
  },
]
```

### Custom Header Rendering

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting()}
        className="flex items-center gap-2"
      >
        Name
        {column.getIsSorted() === 'asc' ? <ChevronUp /> : <ChevronDown />}
      </button>
    ),
  },
  {
    accessorKey: 'email',
    header: () => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        <span>Email Address</span>
      </div>
    ),
  },
]
```

## Sorting

### Enabling Sorting

```typescript
import { useReactTable, getSortedRowModel, SortingState } from '@tanstack/react-table'

function SortableTable() {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Enable sorting
  })

  return <>{/* Render table */}</>
}
```

### Sortable Headers

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-2"
        >
          Name
          {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
          {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
        </button>
      )
    },
  },
]
```

### Multi-Column Sorting

Users can sort multiple columns by holding Shift while clicking headers:

```typescript
const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  enableMultiSort: true, // Enable multi-sorting (default)
  maxMultiSortColCount: 3, // Limit to 3 columns
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### Custom Sort Functions

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    sortingFn: 'alphanumeric', // Built-in: alphanumeric, text, datetime, basic
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId)).getTime()
      const dateB = new Date(rowB.getValue(columnId)).getTime()
      return dateA < dateB ? -1 : dateA > dateB ? 1 : 0
    },
  },
]
```

### Server-Side Sorting

```typescript
const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  manualSorting: true, // Disable client-side sorting
  getCoreRowModel: getCoreRowModel(),
  // Don't provide getSortedRowModel for server-side sorting
})

// Use sorting state to fetch sorted data
useEffect(() => {
  fetchUsers({
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  })
}, [sorting])
```

## Filtering

### Column Filtering

```typescript
import { useReactTable, getFilteredRowModel, ColumnFiltersState } from '@tanstack/react-table'

function FilterableTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
  })

  return <>{/* Render table */}</>
}
```

### Column Filter Input

```typescript
function ColumnFilter({ column }: { column: Column<any> }) {
  const filterValue = column.getFilterValue()

  return (
    <input
      type="text"
      value={(filterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Filter ${column.id}...`}
      className="w-full rounded border px-2 py-1"
    />
  )
}

// Usage in header
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <div>
        <div>Name</div>
        <ColumnFilter column={column} />
      </div>
    ),
  },
]
```

### Global Filtering

```typescript
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'

function GlobalFilterTable() {
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString', // Built-in: includesString, includesStringSensitive, equalsString, arrIncludes, arrIncludesAll, arrIncludesSome, equals, weakEquals, inNumberRange
  })

  return (
    <div>
      <input
        type="text"
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
        className="mb-4 w-full rounded border px-3 py-2"
      />
      {/* Render table */}
    </div>
  )
}
```

### Custom Filter Functions

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, columnId, filterValue) => {
      // Custom filter logic
      const status = row.getValue(columnId)
      return filterValue.includes(status)
    },
  },
]
```

### Fuzzy Search

```typescript
import { rankItem } from '@tanstack/match-sorter-utils'
import { FilterFn } from '@tanstack/react-table'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the ranking info
  addMeta(itemRank)

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const table = useReactTable({
  data,
  columns,
  filterFns: {
    fuzzy: fuzzyFilter,
  },
  globalFilterFn: 'fuzzy', // Use fuzzy filter for global search
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
```

### Debounced Filtering

```typescript
import { useEffect, useState } from 'react'

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}

// Usage
function GlobalFilter({ table }: { table: Table<User> }) {
  return (
    <DebouncedInput
      value={table.getState().globalFilter ?? ''}
      onChange={(value) => table.setGlobalFilter(String(value))}
      placeholder="Search..."
      className="w-full rounded border px-3 py-2"
    />
  )
}
```

## Pagination

### Enabling Pagination

```typescript
import { useReactTable, getPaginationRowModel, PaginationState } from '@tanstack/react-table'

function PaginatedTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
  })

  return <>{/* Render table */}</>
}
```

### Pagination Controls

```typescript
function PaginationControls({ table }: { table: Table<User> }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded border px-2 py-1 disabled:opacity-50"
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded border px-2 py-1 disabled:opacity-50"
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded border px-2 py-1 disabled:opacity-50"
        >
          {'>'}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          className="rounded border px-2 py-1 disabled:opacity-50"
        >
          {'>>'}
        </button>
      </div>

      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>

      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
        className="rounded border px-2 py-1"
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}
```

### Server-Side Pagination

```typescript
function ServerPaginatedTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fetch data with pagination parameters
  const { data: queryData, isLoading } = useQuery({
    queryKey: ['users', pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      fetchUsers({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
      }),
  })

  const table = useReactTable({
    data: queryData?.users ?? [],
    columns,
    pageCount: queryData?.pageCount ?? -1, // Total page count from server
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Disable client-side pagination
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {/* Render table */}
      <PaginationControls table={table} />
    </div>
  )
}
```

## Row Selection

### Enabling Row Selection

```typescript
import { useReactTable, RowSelectionState } from '@tanstack/react-table'

function SelectableTable() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true, // Enable row selection
  })

  return <>{/* Render table */}</>
}
```

### Checkbox Column

```typescript
const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        className="cursor-pointer"
      />
    ),
  },
  // ... other columns
]
```

### Using Selected Rows

```typescript
function TableWithActions() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDeleteSelected = () => {
    const selectedUsers = selectedRows.map((row) => row.original)
    console.log('Deleting:', selectedUsers)
    // Delete users via API
  }

  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="mb-4">
          <span>{selectedRows.length} row(s) selected</span>
          <button
            onClick={handleDeleteSelected}
            className="ml-2 rounded bg-red-600 px-3 py-1 text-white"
          >
            Delete Selected
          </button>
        </div>
      )}
      {/* Render table */}
    </div>
  )
}
```

### Conditional Row Selection

```typescript
const table = useReactTable({
  data,
  columns,
  enableRowSelection: (row) => row.original.status === 'active', // Only active users can be selected
  getCoreRowModel: getCoreRowModel(),
})
```

### Single Row Selection

```typescript
const table = useReactTable({
  data,
  columns,
  enableMultiRowSelection: false, // Only one row at a time
  getCoreRowModel: getCoreRowModel(),
})
```

## Column Visibility

### Toggling Column Visibility

```typescript
import { ColumnVisibilityState } from '@tanstack/react-table'

function TableWithColumnVisibility() {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className="mb-4">
        <label>Toggle Columns:</label>
        {table.getAllLeafColumns().map((column) => (
          <label key={column.id} className="ml-4">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {column.id}
          </label>
        ))}
      </div>
      {/* Render table */}
    </div>
  )
}
```

### Prevent Column Hiding

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false, // Cannot be hidden
  },
  {
    accessorKey: 'name',
    header: 'Name',
    // Can be hidden (default)
  },
]
```

## Integration with TanStack Query

### Server-Side Data Fetching

```typescript
import { useQuery } from '@tanstack/react-query'
import { useReactTable } from '@tanstack/react-table'

interface UsersResponse {
  users: User[]
  totalCount: number
  pageCount: number
}

function ServerTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Fetch data with TanStack Query
  const { data, isLoading, isError } = useQuery<UsersResponse>({
    queryKey: ['users', pagination, sorting, columnFilters],
    queryFn: async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          sortBy: sorting[0]?.id,
          sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
          filters: columnFilters,
        }),
      })
      return response.json()
    },
    keepPreviousData: true, // Keep previous data while fetching
  })

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    pageCount: data?.pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  if (isError) {
    return <div className="text-red-600">Error loading data</div>
  }

  return (
    <div>
      {/* Render table */}
      <div className="mt-2 text-sm text-gray-600">
        Showing {table.getRowModel().rows.length} of {data?.totalCount} results
      </div>
    </div>
  )
}
```

### Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function TableWithMutations() {
  const queryClient = useQueryClient()

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => fetch(`/api/users/${userId}`, { method: 'DELETE' }),
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users'])

      // Optimistically update
      queryClient.setQueryData<UsersResponse>(['users'], (old) => ({
        ...old!,
        users: old!.users.filter((user) => user.id !== userId),
      }))

      return { previousUsers }
    },
    onError: (err, userId, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context?.previousUsers)
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const columns: ColumnDef<User>[] = [
    // ... other columns
    {
      id: 'actions',
      cell: ({ row }) => (
        <button
          onClick={() => deleteUserMutation.mutate(row.original.id)}
          disabled={deleteUserMutation.isLoading}
          className="text-red-600 hover:text-red-700"
        >
          {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete'}
        </button>
      ),
    },
  ]

  // ... table setup
}
```

## Integration with Effect.ts

### Data Transformation with Effect

```typescript
import { Effect } from 'effect'

interface RawUser {
  id: number
  first_name: string
  last_name: string
  email_address: string
}

interface User {
  id: number
  name: string
  email: string
}

// Pure transformation function
function transformUser(raw: RawUser): User {
  return {
    id: raw.id,
    name: `${raw.first_name} ${raw.last_name}`,
    email: raw.email_address.toLowerCase(),
  }
}

function EffectTable() {
  const [data, setData] = useState<User[]>([])

  useEffect(() => {
    const program = Effect.gen(function* () {
      const response = yield* fetchRawUsers()
      const transformed = response.map(transformUser)
      return transformed
    })

    Effect.runPromise(program)
      .then(setData)
      .catch(console.error)
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <>{/* Render table */}</>
}
```

### Table Actions with Effect

```typescript
import { Effect } from 'effect'

class UserService extends Context.Tag('UserService')<
  UserService,
  {
    readonly delete: (id: number) => Effect.Effect<void, DeleteError>
    readonly bulkDelete: (ids: number[]) => Effect.Effect<void, DeleteError>
  }
>() {}

function TableWithEffectActions() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const handleDeleteSelected = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)

    const program = Effect.gen(function* () {
      const userService = yield* UserService
      yield* userService.bulkDelete(selectedIds)
    }).pipe(
      Effect.provide(UserServiceLive),
      Effect.catchAll((error) => {
        console.error('Delete failed:', error)
        return Effect.succeed(undefined)
      })
    )

    Effect.runPromise(program).then(() => {
      // Refetch data or update local state
      setRowSelection({})
    })
  }

  return (
    <div>
      {Object.keys(rowSelection).length > 0 && (
        <button
          onClick={handleDeleteSelected}
          className="mb-4 rounded bg-red-600 px-4 py-2 text-white"
        >
          Delete {Object.keys(rowSelection).length} Selected
        </button>
      )}
      {/* Render table */}
    </div>
  )
}
```

## Styling with Tailwind CSS

### Basic Table Styles

```typescript
function StyledTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### Zebra Striping

```typescript
{
  table.getRowModel().rows.map((row, index) => (
    <tr
      key={row.id}
      className={cn(
        'transition-colors',
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
        'hover:bg-gray-100'
      )}
    >
      {/* cells */}
    </tr>
  ))
}
```

### Sticky Headers

```typescript
<div className="overflow-auto max-h-96">
  <table className="min-w-full">
    <thead className="sticky top-0 bg-gray-50 z-10">
      {/* headers */}
    </thead>
    <tbody>{/* rows */}</tbody>
  </table>
</div>
```

### Responsive Tables

```typescript
// Horizontal scroll on mobile
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* table content */}
  </table>
</div>

// Card layout on mobile, table on desktop
<div className="md:hidden">
  {/* Card layout for mobile */}
  {table.getRowModel().rows.map((row) => (
    <div key={row.id} className="mb-4 rounded border p-4">
      {row.getVisibleCells().map((cell) => (
        <div key={cell.id} className="mb-2">
          <span className="font-medium">{cell.column.id}: </span>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  ))}
</div>

<div className="hidden md:block">
  {/* Standard table for desktop */}
  <table className="min-w-full">
    {/* table content */}
  </table>
</div>
```

### Loading States

```typescript
function TableWithLoading({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-4 h-10 bg-gray-200 rounded"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mb-2 h-16 bg-gray-100 rounded"></div>
        ))}
      </div>
    )
  }

  return <>{/* Render table */}</>
}
```

### Empty States

```typescript
function TableWithEmptyState() {
  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new item.
        </p>
      </div>
    )
  }

  return <>{/* Render table */}</>
}
```

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

## Performance Optimization

### Memoize Columns

```typescript
import { useMemo } from 'react'

function OptimizedTable() {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      // ... other columns
    ],
    [] // Only create columns once
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <>{/* Render table */}</>
}
```

### Virtualization for Large Datasets

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualizedTable() {
  const table = useReactTable({
    data, // Large dataset (1000+ rows)
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { rows } = table.getRowModel()

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Row height
    overscan: 10,
  })

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <table className="min-w-full">
        <thead className="sticky top-0 bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <tr>
            <td style={{ height: `${virtualizer.getTotalSize()}px` }} />
          </tr>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]
            return (
              <tr
                key={row.id}
                style={{
                  position: 'absolute',
                  transform: `translateY(${virtualRow.start}px)`,
                  width: '100%',
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
```

## Testing

### Testing Table Components

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { UserTable } from './UserTable'

describe('UserTable', () => {
  const mockUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]

  test('renders table with user data', () => {
    const html = renderToString(<UserTable users={mockUsers} />)

    expect(html).toContain('Alice')
    expect(html).toContain('alice@example.com')
    expect(html).toContain('Bob')
    expect(html).toContain('bob@example.com')
  })

  test('renders empty state when no users', () => {
    const html = renderToString(<UserTable users={[]} />)

    expect(html).toContain('No data')
  })
})
```

### Testing Sorting Logic

```typescript
test('sorts users by name', () => {
  const users = [
    { id: 1, name: 'Charlie', email: 'charlie@example.com' },
    { id: 2, name: 'Alice', email: 'alice@example.com' },
    { id: 3, name: 'Bob', email: 'bob@example.com' },
  ]

  const sorted = users.sort((a, b) => a.name.localeCompare(b.name))

  expect(sorted[0].name).toBe('Alice')
  expect(sorted[1].name).toBe('Bob')
  expect(sorted[2].name).toBe('Charlie')
})
```

## Best Practices

1. **Memoize columns and data** - Prevent unnecessary re-renders
2. **Use TypeScript generics** - Type-safe columns and data access
3. **Stable row IDs** - Use `getRowId` for stable row identity (UUIDs, not array indices)
4. **Separate concerns** - Keep table logic separate from business logic
5. **Server-side features** - Use server-side pagination/sorting/filtering for large datasets
6. **Optimize rendering** - Use virtualization for tables with 1000+ rows
7. **Accessible markup** - Use semantic HTML (table, thead, tbody, tr, th, td)
8. **Loading states** - Show skeletons or spinners during data fetching
9. **Error handling** - Display friendly error messages when data fails to load
10. **Responsive design** - Consider card layout on mobile, table on desktop

## Common Pitfalls

- ❌ **Unstable data reference** - Creates infinite re-renders
- ❌ **Not memoizing columns** - Columns recreated on every render
- ❌ **Mixing client and server features** - Don't provide row models for server-side features
- ❌ **Forgetting row IDs** - Array indices break selection when data changes
- ❌ **Not handling empty states** - Poor UX when table is empty
- ❌ **Overusing client-side features** - Server-side is better for large datasets
- ❌ **Ignoring accessibility** - Use semantic HTML and ARIA attributes
- ❌ **Not optimizing large tables** - Use virtualization for 1000+ rows

## When to Use TanStack Table

✅ **Use TanStack Table when:**

- Building data-heavy applications (admin panels, dashboards)
- Need full control over table markup and styling
- Require advanced features (sorting, filtering, pagination, selection)
- Working with large datasets that need optimization
- Want type-safe table implementation
- Building reusable table components

❌ **Consider alternatives when:**

- Simple list rendering (use `map()` directly)
- Pre-styled tables are acceptable (component library tables)
- No advanced features needed (basic HTML table sufficient)

## Full Stack Integration with Layered Architecture

TanStack Table integrates seamlessly with Omnera's layered architecture. This section demonstrates the complete flow from Domain → Infrastructure → Application → Presentation.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER (React Components + Hono Routes)        │
│  - UserTable.tsx (React component with TanStack Table)     │
│  - /api/users route (Hono endpoint)                        │
└────────────────────┬────────────────────────────────────────┘
                     │ async/await
┌────────────────────▼────────────────────────────────────────┐
│ APPLICATION LAYER (Effect Programs - Business Logic)        │
│  - GetUsers.ts (Effect.gen program)                         │
│  - DeleteUser.ts (Effect.gen program)                       │
└────────────────────┬────────────────────────────────────────┘
                     │ Effect.gen
┌────────────────────▼────────────────────────────────────────┐
│ DOMAIN LAYER (Pure Functions - Business Rules)              │
│  - User entity, validation functions                        │
└─────────────────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ INFRASTRUCTURE LAYER (Effect Services - External Systems)   │
│  - UserRepository (Drizzle ORM)                             │
│  - Logger, EmailService                                     │
└─────────────────────────────────────────────────────────────┘
```

### Complete Example: Users Table with Authentication

#### 1. Domain Layer (Pure Business Logic)

```typescript
// src/domain/user/user.ts
export interface User {
  readonly id: number
  readonly name: string
  readonly email: string
  readonly role: 'admin' | 'user'
  readonly status: 'active' | 'inactive'
  readonly createdAt: Date
}

// Pure validation function
export function canDeleteUser(currentUser: User, targetUser: User): boolean {
  // Only admins can delete users
  if (currentUser.role !== 'admin') return false

  // Cannot delete yourself
  if (currentUser.id === targetUser.id) return false

  // Cannot delete other admins
  if (targetUser.role === 'admin') return false

  return true
}

// Pure transformation function
export function toUserListItem(user: User): UserListItem {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    statusBadge: user.status === 'active' ? 'Active' : 'Inactive',
    canDelete: user.role !== 'admin', // Will be refined with current user context
  }
}
```

#### 2. Infrastructure Layer (Database Access)

```typescript
// src/infrastructure/database/repositories/UserRepository.ts
import { Effect, Context } from 'effect'
import { db } from '../drizzle'
import { users } from '../schema'
import { eq } from 'drizzle-orm'

export class DatabaseError {
  readonly _tag = 'DatabaseError'
  constructor(readonly message: string) {}
}

export class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly findAll: () => Effect.Effect<readonly User[], DatabaseError>
    readonly findById: (id: number) => Effect.Effect<User, DatabaseError>
    readonly delete: (id: number) => Effect.Effect<void, DatabaseError>
    readonly bulkDelete: (ids: readonly number[]) => Effect.Effect<void, DatabaseError>
  }
>() {}

// Live implementation with Drizzle ORM
export const UserRepositoryLive = Layer.succeed(UserRepository, {
  findAll: () =>
    Effect.tryPromise({
      try: async () => {
        const result = await db.select().from(users)
        return result.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role as 'admin' | 'user',
          status: row.status as 'active' | 'inactive',
          createdAt: new Date(row.created_at),
        }))
      },
      catch: (error) => new DatabaseError(`Failed to fetch users: ${error}`),
    }),

  findById: (id: number) =>
    Effect.tryPromise({
      try: async () => {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
        if (result.length === 0) {
          throw new Error('User not found')
        }
        return result[0] as User
      },
      catch: (error) => new DatabaseError(`Failed to fetch user ${id}: ${error}`),
    }),

  delete: (id: number) =>
    Effect.tryPromise({
      try: async () => {
        await db.delete(users).where(eq(users.id, id))
      },
      catch: (error) => new DatabaseError(`Failed to delete user ${id}: ${error}`),
    }),

  bulkDelete: (ids: readonly number[]) =>
    Effect.tryPromise({
      try: async () => {
        await db.delete(users).where(inArray(users.id, ids as number[]))
      },
      catch: (error) => new DatabaseError(`Failed to bulk delete users: ${error}`),
    }),
})
```

#### 3. Application Layer (Business Logic with Effect)

```typescript
// src/application/users/GetUsers.ts
import { Effect } from 'effect'
import { UserRepository } from '@/infrastructure/database/repositories/UserRepository'
import { toUserListItem } from '@/domain/user/user'

export const GetUsers = Effect.gen(function* () {
  const userRepo = yield* UserRepository

  const users = yield* userRepo.findAll()

  return users.map(toUserListItem)
})

// src/application/users/DeleteUser.ts
import { Effect } from 'effect'
import { UserRepository } from '@/infrastructure/database/repositories/UserRepository'
import { AuthService } from '@/infrastructure/auth/AuthService'
import { canDeleteUser } from '@/domain/user/user'

export class UnauthorizedError {
  readonly _tag = 'UnauthorizedError'
  constructor(readonly message: string) {}
}

export class UserNotFoundError {
  readonly _tag = 'UserNotFoundError'
  constructor(readonly userId: number) {}
}

export const DeleteUser = (userId: number) =>
  Effect.gen(function* () {
    const userRepo = yield* UserRepository
    const authService = yield* AuthService

    // Get current user (from Better Auth session)
    const currentUser = yield* authService.getCurrentUser()

    // Get target user
    const targetUser = yield* userRepo.findById(userId)

    // Domain validation
    if (!canDeleteUser(currentUser, targetUser)) {
      return yield* Effect.fail(
        new UnauthorizedError('You do not have permission to delete this user')
      )
    }

    // Delete user
    yield* userRepo.delete(userId)

    return { success: true, deletedUserId: userId }
  })

// src/application/users/BulkDeleteUsers.ts
export const BulkDeleteUsers = (userIds: readonly number[]) =>
  Effect.gen(function* () {
    const userRepo = yield* UserRepository
    const authService = yield* AuthService

    const currentUser = yield* authService.getCurrentUser()

    // Fetch all target users
    const targetUsers = yield* Effect.all(userIds.map((id) => userRepo.findById(id)))

    // Validate each deletion
    const canDeleteAll = targetUsers.every((user) => canDeleteUser(currentUser, user))

    if (!canDeleteAll) {
      return yield* Effect.fail(
        new UnauthorizedError('You do not have permission to delete one or more users')
      )
    }

    // Bulk delete
    yield* userRepo.bulkDelete(userIds)

    return { success: true, deletedCount: userIds.length }
  })
```

#### 4. Presentation Layer - Hono Route (API Endpoint)

```typescript
// src/presentation/routes/users.ts
import { Hono } from 'hono'
import { GetUsers, DeleteUser, BulkDeleteUsers } from '@/application/users'
import { AppLayer } from '@/infrastructure/layers'

const app = new Hono()

// GET /api/users - Fetch all users
app.get('/api/users', async (c) => {
  const program = GetUsers.pipe(Effect.provide(AppLayer))

  const result = await Effect.runPromise(program.pipe(Effect.either))

  if (result._tag === 'Left') {
    const error = result.left
    return c.json({ error: error.message }, 500)
  }

  return c.json({ users: result.right }, 200)
})

// DELETE /api/users/:id - Delete single user
app.delete('/api/users/:id', async (c) => {
  const userId = Number(c.req.param('id'))

  const program = DeleteUser(userId).pipe(Effect.provide(AppLayer))

  const result = await Effect.runPromise(program.pipe(Effect.either))

  if (result._tag === 'Left') {
    const error = result.left

    if (error._tag === 'UnauthorizedError') {
      return c.json({ error: error.message }, 403)
    }

    if (error._tag === 'UserNotFoundError') {
      return c.json({ error: `User ${error.userId} not found` }, 404)
    }

    return c.json({ error: 'Internal server error' }, 500)
  }

  return c.json(result.right, 200)
})

// POST /api/users/bulk-delete - Delete multiple users
app.post('/api/users/bulk-delete', async (c) => {
  const body = await c.req.json()
  const userIds = body.userIds as number[]

  const program = BulkDeleteUsers(userIds).pipe(Effect.provide(AppLayer))

  const result = await Effect.runPromise(program.pipe(Effect.either))

  if (result._tag === 'Left') {
    const error = result.left

    if (error._tag === 'UnauthorizedError') {
      return c.json({ error: error.message }, 403)
    }

    return c.json({ error: 'Internal server error' }, 500)
  }

  return c.json(result.right, 200)
})

export default app
```

#### 5. Presentation Layer - React Component (TanStack Table)

```typescript
// src/presentation/components/UsersTable.tsx
import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

interface UserListItem {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  statusBadge: string
  canDelete: boolean
}

export function UsersTable() {
  const queryClient = useQueryClient()
  const [rowSelection, setRowSelection] = useState({})

  // Fetch users with TanStack Query
  const { data, isLoading, isError } = useQuery<{ users: UserListItem[] }>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (userIds: number[]) => {
      const response = await fetch('/api/users/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setRowSelection({})
    },
  })

  // Column definitions
  const columns = useMemo<ColumnDef<UserListItem>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.original.canDelete}
            onChange={row.getToggleSelectedHandler()}
            className="cursor-pointer"
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (info) => {
          const role = info.getValue<'admin' | 'user'>()
          return (
            <span
              className={cn(
                'rounded-full px-2 py-1 text-xs font-medium',
                role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              )}
            >
              {role}
            </span>
          )
        },
      },
      {
        accessorKey: 'statusBadge',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue<string>()
          return (
            <span
              className={cn(
                'rounded-full px-2 py-1 text-xs font-medium',
                status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              )}
            >
              {status}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const user = row.original
          return (
            <button
              onClick={() => deleteUserMutation.mutate(user.id)}
              disabled={!user.canDelete || deleteUserMutation.isLoading}
              className={cn(
                'text-red-600 hover:text-red-700',
                (!user.canDelete || deleteUserMutation.isLoading) && 'cursor-not-allowed opacity-50'
              )}
            >
              {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete'}
            </button>
          )
        },
      },
    ],
    [deleteUserMutation]
  )

  // Table instance
  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: (row) => row.original.canDelete,
  })

  // Handle bulk delete
  const handleBulkDelete = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)

    bulkDeleteMutation.mutate(selectedIds)
  }

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  if (isLoading) {
    return <div className="animate-pulse">Loading users...</div>
  }

  if (isError) {
    return <div className="text-red-600">Failed to load users</div>
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleteMutation.isLoading}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {bulkDeleteMutation.isLoading ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-6 py-4 text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

### Key Patterns Demonstrated

**1. Effect.gen for Business Logic (Application Layer)**:
- Use `Effect.gen` for all business logic with type-safe error handling
- Explicit dependencies via Effect Context (UserRepository, AuthService)
- Pure functions in Domain layer called from Effect programs

**2. async/await in Presentation Layer**:
- Hono routes use `async/await` to run Effect programs with `Effect.runPromise`
- React components use `async/await` with TanStack Query for data fetching

**3. TanStack Query Integration**:
- `useQuery` for fetching data (caching, refetching, loading states)
- `useMutation` for mutations (optimistic updates, error handling)
- Automatic cache invalidation after mutations

**4. Better Auth Integration**:
- AuthService provides current user via Effect Context
- Domain layer validates permissions (pure function)
- Unauthorized errors handled at API level

**5. Drizzle ORM Integration**:
- UserRepository wraps Drizzle queries in Effect programs
- Type-safe database access with schema
- Error handling with DatabaseError type

### Benefits of This Architecture

- **Type Safety**: Errors are explicit in type signatures
- **Testability**: Pure functions and Effect programs are trivial to test
- **Separation of Concerns**: Each layer has a clear responsibility
- **Composability**: Business logic is composable via Effect
- **Maintainability**: Changes to one layer don't affect others
- **Performance**: TanStack Query handles caching and refetching

## References

- TanStack Table documentation: https://tanstack.com/table/latest/docs/introduction
- TanStack Table API reference: https://tanstack.com/table/latest/docs/api/core/table
- TanStack Query integration: https://tanstack.com/query/latest
- React Virtual (virtualization): https://tanstack.com/virtual/latest
- Examples and demos: https://tanstack.com/table/latest/docs/framework/react/examples/basic
- Omnera Layer-Based Architecture: [layer-based-architecture.md](../../architecture/layer-based-architecture.md)
- Effect.ts Documentation: [effect.md](../framework/effect.md)
- Better Auth Documentation: [better-auth.md](../auth/better-auth.md)
- Drizzle ORM Documentation: [drizzle.md](../database/drizzle.md)
