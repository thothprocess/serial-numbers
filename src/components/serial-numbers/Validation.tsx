import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LuSearch } from 'react-icons/lu';
import { Customer, fetchCustomerBySN } from '@/api/queries/customers';
import { CustomerResult } from '@/components/serial-numbers/CustomerResult';

export const Validation: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSearch = async () => {
    try {
      const response = await fetchCustomerBySN(searchValue);
      setCustomer(response);
      setError(null);
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
        <Button variant="outline" size="icon" onClick={handleSearch}>
          <LuSearch className="w-5 h-5" />
        </Button>
      </div>
      {customer && <CustomerResult customer={customer} />}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};
