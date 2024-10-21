import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Customer, fetchCustomerBySN } from '@/api/queries/customers';
import { CustomerResult } from '@/components/serial-numbers/CustomerResult';

export const Validation: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSearch = async () => {
    try {
      const response = await fetchCustomerBySN(searchValue);
      if (response.items.length > 0) {
        const customer = response.items[0];
        setCustomer(customer);
        setError(null);
      }
    } catch (err) {
      setError('Error finding customer.');
      setCustomer(null);
    }
  };
  return (
    <>
      <PageHeader title="Validation" />
      <div className="flex space-x-2 items-center my-2">
        <Input
          id="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter serial number"
          className="flex-1"
        />
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {customer && <CustomerResult customer={customer} />}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};
