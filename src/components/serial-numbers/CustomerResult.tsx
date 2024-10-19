import { Customer } from '@/api/queries/customers';
import { applications, versions } from '@/api/queries/products';

interface CustomerResultProps {
  customer?: Customer;
}

export const CustomerResult: React.FC<CustomerResultProps> = ({ customer }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold underline">Customer</h3>
      <p>
        <strong>ID:</strong> {customer?.id}
      </p>
      <p>
        <strong>Name:</strong> {customer?.fullName}
      </p>
      <p>
        <strong>Email:</strong> {customer?.email}
      </p>
      <p>
        <strong>Phone:</strong> {customer?.phone}
      </p>
      <p>
        <strong>Application:</strong>{' '}
        {applications &&
          applications.find(
            (application) => application.value === customer?.application
          )?.label}
      </p>
      <p>
        <strong>Version:</strong>{' '}
        {versions &&
          versions.find((version) => version.value === customer?.version)
            ?.label}
      </p>
    </div>
  );
};
