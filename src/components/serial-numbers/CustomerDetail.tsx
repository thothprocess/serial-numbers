import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer, updateCustomer } from '@/api/queries/customers';
import { generateSN } from '@/api/queries/serial-numbers';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface CustomerDetailProps {
  customer?: Customer;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
  const queryClient = useQueryClient();
  const [serialNumber, setSerialNumber] = useState(null);

  const mutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      });
    },
  });

  const handleGenerateSN = async (event) => {
    event.preventDefault();
    if (customer) {
      const result = await generateSN(customer);
      setSerialNumber(result);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (serialNumber) {
      mutation.mutate({ ...customer, serialNumber });
    }
  };

  return (
    <div className="rounded-md border">
      <form onSubmit={onSubmit}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Email</TableCell>
              <TableCell>{customer?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Serial</TableCell>
              <TableCell>
                {serialNumber}{' '}
                <Button variant="outline" size="sm" onClick={handleGenerateSN}>
                  Generate
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Updating...' : 'Update'}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
    </div>
  );
};
