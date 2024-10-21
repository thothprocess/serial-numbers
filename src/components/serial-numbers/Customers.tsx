import React, { useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  PaginationState,
  flexRender,
} from '@tanstack/react-table';
import { Customer, fetchCustomers } from '@/api/queries/customers';
import { applications, versions } from '@/api/queries/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectGroup,
  SelectLabel,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/PageHeader';
import { DialogWrapper } from '@/components/DialogWrapper';
import { LuMoreHorizontal, LuChevronDown } from 'react-icons/lu';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useCopyToClipboard } from 'react-use';
import { CustomerDetail } from '@/components/serial-numbers/CustomerDetail';
import { MaskedSerialNumber } from '@/components/serial-numbers/MaskedSerialNumber';
import { unparse } from 'papaparse';

export const Customers: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isExporting, setIsExporting] = useState(false);

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        id: 'select',
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: 'id',
        enableColumnFilter: true,
        filterFn: 'includesString',
        enableSorting: true,
        header: 'ID',
        cell: ({ row }) => <div>{row.getValue('id')}</div>,
      },
      {
        accessorKey: 'fullName',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'includesString',
        header: 'Name',
        cell: ({ row }) => (
          <div>
            <div>{row.getValue('fullName')}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'company',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'includesString',
        header: 'Company',
        cell: ({ row }) => (
          <div className="hidden sm:table-cell">{row.getValue('company')}</div>
        ),
      },
      {
        accessorKey: 'address',
        enableSorting: true,
        header: 'Address',
        cell: ({ row }) => {
          return (
            <div className="hidden sm:table-cell">
              <div>{row.original.address.streetAddress}</div>
              <div>{row.original.address.secondaryAddress}</div>
              <div>
                {row.original.address.city}, {row.original.address.stateAbbr}
              </div>
              <div>{row.original.address.zipCode}</div>
              <div>{row.original.address.country}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'phone',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'includesString',
        header: 'Phone',
        cell: ({ row }) => {
          return (
            <div className="hidden sm:table-cell">
              <div>{row.getValue('phone')}</div>
            </div>
          );
        },
      },
      {
        id: 'order',
        enableSorting: true,
        enableHiding: true,
        header: 'Order',
        cell: ({ row }) => (
          <div>
            <div>&nbsp;</div>
          </div>
        ),
      },
      {
        accessorKey: 'application',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'includesString',
        header: 'Application',
        cell: ({ row }) => {
          const application = applications.find(
            (application) => application.value === row.original.application
          );
          const version = versions.find(
            (version) => version.value === row.original.version
          );
          return (
            <div>
              <div>{application?.label}</div>
              <div>
                <Badge variant="outline">{version?.label}</Badge>
              </div>
            </div>
          );
        },
      },
      {
        id: 'expiration',
        enableSorting: true,
        enableHiding: true,
        header: 'Expiration',
        cell: ({ row }) => (
          <div>
            <div>&nbsp;</div>
          </div>
        ),
      },
      {
        id: 'activation',
        enableSorting: true,
        enableHiding: true,
        header: 'Activation',
        cell: ({ row }) => (
          <div>
            <div>0/10</div>
          </div>
        ),
      },
      {
        accessorKey: 'serialNumber',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'includesString',
        header: 'Serial',
        cell: ({ row }) => (
          <div>
            <MaskedSerialNumber serial={row.getValue('serialNumber')} />
          </div>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <LuMoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => copyToClipboard(customer.id || '')}
                >
                  Copy customer ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => copyToClipboard(customer.serialNumber || '')}
                >
                  Copy serial number
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsCustomerDialogOpen(true);
                  }}
                >
                  View customer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const { data, error, isLoading } = useQuery({
    queryKey: ['customers', pagination.pageIndex + 1, pagination.pageSize],
    queryFn: () =>
      fetchCustomers(pagination.pageIndex + 1, pagination.pageSize),
    placeholderData: keepPreviousData,
  });

  const handleShowCustomerDetailChange = (open: boolean) => {
    setIsCustomerDialogOpen(open);
  };

  const handleExport = () => {
    const headers = table
      .getHeaderGroups()
      .flatMap((headerGroup) =>
        headerGroup.headers
          .map((header) =>
            typeof header.column.columnDef.header === 'function'
              ? null
              : header.column.columnDef.header
          )
          .filter(Boolean)
      );
    const rows = table.getRowModel().rows.map((row) =>
      row
        .getVisibleCells()
        .map((cell) => cell.getValue())
        .filter((value) => value !== undefined)
    );
    const csvData = unparse({
      fields: headers,
      data: rows,
    });
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const table = useReactTable({
    columns,
    data: data?.items,
    manualPagination: true,
    pageCount: Math.ceil((data?.total || 0) / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      rowSelection,
      sorting,
      columnVisibility,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <>
      <PageHeader title="Customers" />
      <div className="w-full">
        <div className="flex items-center py-2 space-x-2">
          <Input
            placeholder="Search customers..."
            value={(table.getState().globalFilter ?? '') as string}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-sm mr-auto"
          />
          <div className="space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <LuChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={handleExport}>
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className="cursor-pointer flex items-center"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-1">
                              {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === 'asc' ? (
                                  <FaSortUp />
                                ) : (
                                  <FaSortDown />
                                )
                              ) : (
                                <FaSort />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Select
            defaultValue={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select limit</SelectLabel>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedCustomer && (
        <DialogWrapper
          open={isCustomerDialogOpen}
          onOpenChange={handleShowCustomerDetailChange}
          title="Customer"
        >
          <CustomerDetail customer={selectedCustomer} />
        </DialogWrapper>
      )}
    </>
  );
};
