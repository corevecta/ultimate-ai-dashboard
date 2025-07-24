import React from 'react'
import { TableColumn, BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface DataTableProps<T = any> extends BaseComponentProps {
  data: T[]
  columns: TableColumn<T>[]
  onRowClick?: (row: T) => void
  emptyMessage?: string
}

export function DataTable<T = any>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data available',
  className
}: DataTableProps<T>) {
  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(
        typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor as keyof T],
        row
      )
    }
    return typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor as keyof T]
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-sm font-medium text-gray-400',
                  column.sortable && 'cursor-pointer hover:text-white'
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-white/5 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-white/5'
              )}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-gray-300">
                  {getCellValue(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}