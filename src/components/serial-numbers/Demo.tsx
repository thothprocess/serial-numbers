import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/PageHeader';

export const Demo: React.FC = () => {
  const [daysUntilExpiration, setDaysUntilExpiration] = useState(0);
  const [expirationDate, setExpirationDate] = useState<Date>(new Date());

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

  const generateFlags = (flagNumber: number) => {
    return [...Array(32).keys()].map((index) => {
      return {
        label: `Flag ${flagNumber} Value ${index}`,
        value: (index + 1).toString(),
      };
    });
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

  useEffect(() => {
    const diffTime = expirationDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntilExpiration(diffDays);
  }, [expirationDate]);

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
                  <Select value={field?.value} onValueChange={field?.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
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
              <FormItem>
                <FormLabel>Flag 1</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field?.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Flag 1" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {generateFlags(1).map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flag_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flag 1</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field?.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Flag 1" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {generateFlags(1).map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flag_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flag 2</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field?.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Flag 2" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {generateFlags(2).map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flag_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flag 3</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field?.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Flag 3" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {generateFlags(3).map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flag_4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flag 4</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field?.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Flag 4" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {generateFlags(4).map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a version" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {generateExtendDays().map((version) => (
                      <SelectItem key={version.value} value={version.value}>
                        {version.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
