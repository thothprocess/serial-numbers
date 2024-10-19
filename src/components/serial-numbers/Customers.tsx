import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { LuMoreHorizontal } from 'react-icons/lu';
import { PageHeader } from '@/components/PageHeader';
import { MaskedSerialNumber } from '@/components/serial-numbers/MaskedSerialNumber';
import { Customer, usePagination } from '@/api/queries/customers';
import { applications, versions } from '@/api/queries/products';
import { ProgressDialog } from '@/components/ProgressDialog';
import { ResponsiveDialog } from '@/components/ResponsiveDialog';
import { CustomerDetail } from '@/components/serial-numbers/CustomerDetail';

export const Customers: React.FC = () => {
  const { page, limit, setPage, setLimit } = usePagination();
  const { selectedCustomer, setSelectedCustomer } = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
  };

  const handleShowCustomerDetail = () => {
    setIsCustomerDialogOpen(true);
  };

  const handleShowCustomerDetailChange = (open: boolean) => {
    setIsCustomerDialogOpen(open);
  };

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
                  onClick={() =>
                    navigator.clipboard.writeText(customer.id || '')
                  }
                >
                  Copy customer ID
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

  return (
    <>
      <PageHeader title="Customers" />

      <div className="space-x-1">
        <Button variant="outline" onClick={handleExport}>
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
        <Button variant="outline" onClick={handleShowCustomerDetail}>
          View Customer
        </Button>
      </div>

      <ProgressDialog
        isOpen={isExporting}
        title="Exporting"
        description="Please wait while we complete your request."
        onClose={() => setIsExporting(false)}
      />

      <ResponsiveDialog
        open={isCustomerDialogOpen}
        onOpenChange={handleShowCustomerDetailChange}
        title="Customer"
      >
        <CustomerDetail customer={selectedCustomer} />
      </ResponsiveDialog>
    </>
  );
};
