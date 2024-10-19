import { useState } from 'react';
import { Customer } from '@/api/queries/customers';
import { generateSN } from '@/api/queries/serial-numbers';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface CustomerDetailProps {
  customer?: Customer;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
  const [serialNumber, setSerialNumber] = useState(null);

  const handleGenerateSN = async () => {
    if (customer) {
      const result = await generateSN(customer);
      setSerialNumber(result);
    }
  };

  return (
    <div className="rounded-md border">
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
        </TableBody>
      </Table>
    </div>
  );
};
