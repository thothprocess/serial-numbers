import React, { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectGroup,
  SelectLabel,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { createCustomer } from '@/api/queries/customers';
import { applications, versions, options } from '@/api/queries/products';
import { Country, State, City } from 'country-state-city';

export const Registration = () => {
  const queryClient = useQueryClient();
  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<(typeof State)[]>([]);
  const [cities, setCities] = useState<(typeof City)[]>([]);

  const addressSchema = z.object({
    streetAddress: z.string().min(1, 'Street address is required'),
    secondaryAddress: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    stateAbbr: z.string().min(2, 'State abbreviation is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
  });

  const formSchema = z.object({
    fullName: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email(),
    company: z.string().optional(),
    address: addressSchema,
    phone: z
      .string()
      .min(10, { message: 'Invalid phone number' })
      .max(14, { message: 'Invalid phone number' }),
    application: z.string().min(1, { message: 'Application is required' }),
    version: z.string().min(1, { message: 'Version is required' }),
    options: z.array(z.string()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      address: {
        streetAddress: '',
        secondaryAddress: '',
        country: '',
        stateAbbr: '',
        city: '',
        zipCode: '',
      },
      phone: '',
      application: '2',
      version: '1',
      options: [],
    },
  });

  const selectedCountry = form.watch('address.country');
  const selectedState = form.watch('address.stateAbbr');

  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      setStates(stateList);
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      const cityList = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(cityList);
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry]);

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Submitted Data:', data);

    const customer = {
      fullName: data.fullName,
      email: data.email,
      company: data.company,
      address: {
        streetAddress: data.address.streetAddress,
        secondaryAddress: data.address.secondaryAddress,
        city: data.address.city,
        stateAbbr: data.address.stateAbbr,
        zipCode: data.address.zipCode,
        country: data.address.country,
      },
      phone: data.phone,
      application: data.application,
      version: data.version,
      options: data.options,
      serialNumber: '',
    };

    mutation.mutate(customer);
  };

  return (
    <>
      <PageHeader title="Registration" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.secondaryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.stateAbbr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.length > 0 ? (
                        states.map((state) => (
                          <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled>No states available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.length > 0 ? (
                        cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled>No cities available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="application"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select application" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectLabel>Select application</SelectLabel>
                        {applications.map((option, index) => {
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
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            name="options"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Options</FormLabel>
                </div>
                <div className="flex flex-row space-x-5">
                  {options.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="options"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([field.value, option.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Create
          </Button>
        </form>
      </Form>
    </>
  );
};
