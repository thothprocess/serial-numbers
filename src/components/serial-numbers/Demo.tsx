import React, { useEffect, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface DemoKeyFlagFieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  flagNumber: number;
  field?: FieldValues;
}

const DemoKeyFlagField: React.FC<DemoKeyFlagFieldProps> = ({
  label,
  placeholder,
  description,
  flagNumber,
  field,
}) => {
  const generateFlags = (flagNumber: number) => {
    return [...Array(32).keys()].map((index) => {
      return {
        label: `Flag ${flagNumber} Value ${index}`,
        value: (index + 1).toString(),
      };
    });
  };

  return (
    <div>
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Select {...field} onValueChange={field?.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {generateFlags(flagNumber).map((option, index) => {
                  return (
                    <SelectItem key={index} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    </div>
  );
};

export const Demo: React.FC = () => {
  const [expirationDate, setExpirationDate] = useState<Date>(new Date());
  const [daysUntilExpiration, setDaysUntilExpiration] = useState(0);

  useEffect(() => {
    const diffTime = expirationDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntilExpiration(diffDays);
  }, [expirationDate]);

  const versions = [...Array(10).keys()].map((index) => {
    const value = (index + 1).toString();
    return {
      label: value,
      value,
    };
  });

  const formSchema = z.object({
    version: z.string().min(1, {
      message: 'Version is required',
    }),
    expiration_date: z
      .date()
      .min(new Date(), { message: 'Date must be today or later' }),
    flag_1: z.string().min(1, {
      message: 'Flag 1 required',
    }),
    flag_2: z.string().min(1, {
      message: 'Flag 2 required',
    }),
    flag_3: z.string().min(1, {
      message: 'Flag 3 required',
    }),
    flag_4: z.string().min(1, {
      message: 'Flag 4 required',
    }),
    extend_demo: z.string().min(1, {
      message: 'Extend Demo is required',
    }),
    extend_by: z.string().min(1, {
      message: 'Extend By is required',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: '1',
      expiration_date: new Date(),
      flag_1: '1',
      flag_2: '1',
      flag_3: '1',
      flag_4: '1',
      extend_demo: '',
      extend_by: '1',
    },
  });

  const addDays = (days: number) => {
    const newDate = new Date(expirationDate);
    newDate.setDate(newDate.getDate() + days);
    setExpirationDate(newDate);
    console.log(expirationDate);
  };

  const generateExtendDays = () => {
    return [...Array(60).keys()].map((index) => {
      const plural = index === 0 ? 'Day' : 'Days';
      return {
        label: `Extend By ${index + 1} ${plural}`,
        value: (index + 1).toString(),
      };
    });
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Submitted Data:', data);
  };

  return (
    <>
      <PageHeader title="Demo" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field?.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectLabel>Select version</SelectLabel>
                        {versions.map((option, index) => {
                          return (
                            <SelectItem key={index} value={option.value}>
                              {option.label}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiration_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demo Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value.toDateString()}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <p className="text-sm">
              {daysUntilExpiration > 0
                ? `Days until expiration: ${daysUntilExpiration}`
                : 'Expired today'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => addDays(1)} variant="outline">
              +1
            </Button>
            <Button onClick={() => addDays(5)} variant="outline">
              +5
            </Button>
            <Button
              onClick={() => {
                setExpirationDate(new Date());
                console.log(expirationDate);
              }}
              variant="outline"
            >
              Reset
            </Button>
          </div>
          <FormField
            control={form.control}
            name="flag_1"
            render={({ field }) => (
              <DemoKeyFlagField label="Flag 1" flagNumber={1} field={field} />
            )}
          />
          <FormField
            control={form.control}
            name="flag_2"
            render={({ field }) => (
              <DemoKeyFlagField label="Flag 2" flagNumber={2} field={field} />
            )}
          />
          <FormField
            control={form.control}
            name="flag_3"
            render={({ field }) => (
              <DemoKeyFlagField label="Flag 3" flagNumber={3} field={field} />
            )}
          />
          <FormField
            control={form.control}
            name="flag_4"
            render={({ field }) => (
              <DemoKeyFlagField label="Flag 4" flagNumber={4} field={field} />
            )}
          />
          <FormField
            control={form.control}
            name="extend_demo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extend Demo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="extend_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extend By</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a version" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {generateExtendDays().map((version) => (
                      <SelectItem value={version.value}>
                        {version.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Result</FormLabel>
            <FormControl>
              <pre className="mt-2 rounded-md p-4 bg-slate-100">
                <code className="font-mono">&nbsp;</code>
              </pre>
            </FormControl>
          </FormItem>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
