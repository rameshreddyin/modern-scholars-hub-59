
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: {
    accessor: keyof T | ((row: T) => string | number);
    header: string;
    cell?: (row: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  className?: string;
  onRowClick?: (row: T) => void;
}

function DataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  className,
  onRowClick
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | ((row: T) => string | number);
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const { key, direction } = sortConfig;
      
      let aValue: any, bValue: any;
      
      if (typeof key === 'function') {
        aValue = key(a);
        bValue = key(b);
      } else {
        aValue = a[key];
        bValue = b[key];
      }
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof T | ((row: T) => string | number)) => {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: 'asc' });
    } else {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    }
  };

  return (
    <div className={cn("overflow-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-secondary text-secondary-foreground">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="p-3 text-left font-medium text-sm border-b"
              >
                {column.sortable ? (
                  <div 
                    className="flex items-center gap-1 cursor-pointer group"
                    onClick={() => handleSort(column.accessor)}
                  >
                    {column.header}
                    {sortConfig?.key === column.accessor ? (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={cn(
                  "border-b border-border hover:bg-muted/50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="p-3 text-sm">
                    {column.cell 
                      ? column.cell(row) 
                      : typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-muted-foreground">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
