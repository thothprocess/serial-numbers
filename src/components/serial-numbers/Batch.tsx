import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { useCopyToClipboard } from 'react-use';
import { Customer, fetchCustomerById } from '@/api/queries/customers';
import { batchGenerate } from '@/api/queries/serial-numbers';
import { CustomerResult } from '@/components/serial-numbers/CustomerResult';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/PageHeader';
import { SelectWrapper } from '@/components/SelectWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaSpinner } from 'react-icons/fa';
import { LuCopy, LuSearch } from 'react-icons/lu';

export const Batch: React.FC = () => {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [searchValue, setSearchValue] = useState<string>('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    try {
      const response = await fetchCustomerById(Number(searchValue));
      setCustomer(response);
      setError(null);
    } catch (err) {
      setError('Error finding customer.');
      setCustomer(null);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const customer = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      company: faker.company.name(),
      address: {
        streetAddress: faker.location.street(),
        secondaryAddress: faker.location.secondaryAddress(),
        city: faker.location.city(),
        stateAbbr: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      phone: faker.phone.number({ style: 'international' }),
      application: '2',
      version: '1',
      options: '',
      serialNumber: '',
    };
    batchGenerate(customer, count)
      .then((result) => {
        setSerialNumbers(result);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const copySingleSerial = (serial: string) => {
    copyToClipboard(serial);
    toast({
      title: 'Copied to clipboard',
    });
  };

  const copyAllSerials = () => {
    copyToClipboard(serialNumbers.join('\n'));
    toast({
      title: 'All serial numbers copied to clipboard',
    });
  };

  const options = [
    { label: '1', value: '1' },
    { label: '5', value: '5' },
    { label: '10', value: '10' },
  ];

  return (
    <>
      <PageHeader title="Batch" />
      <div className="flex space-x-2 items-center my-2">
        <Input
          id="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter customer ID"
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={handleSearch}>
          <LuSearch className="w-5 h-5" />
        </Button>
      </div>
      {customer && <CustomerResult customer={customer} />}
      {error && <p className="text-red-500">{error}</p>}
      <div className="my-2">
        <SelectWrapper
          value={`${count}`}
          onValueChange={(value) => {
            setCount(value);
          }}
          options={options}
        />
        <Button
          className="w-full my-2"
          onClick={handleGenerate}
          disabled={!customer || !count || loading}
        >
          {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
      <div className="mt-4">
        {loading ? (
          <p>Generating serial numbers...</p>
        ) : (
          <ul>
            {serialNumbers.map((serial, index) => (
              <li key={index}>
                <span className="font-mono">{serial}</span>
                <Button
                  variant="ghost"
                  onClick={() => copySingleSerial(serial)}
                  className="ml-2"
                  aria-label="Copy serial"
                >
                  <LuCopy />
                </Button>
              </li>
            ))}
          </ul>
        )}
        {serialNumbers.length > 0 && (
          <Button className="w-full mt-4" onClick={copyAllSerials}>
            Copy All
          </Button>
        )}
      </div>
    </>
  );
};
