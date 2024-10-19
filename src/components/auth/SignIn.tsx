import React from 'react';
import { Link } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';

export const SignIn: React.FC = () => {
  return (
    <div className="my-2">
      <PageHeader title="Sign-In" />
      <div className="grid gap-4 my-2">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Sign-In
        </Button>
        <Button variant="outline" className="w-full">
          SignIn with Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="#" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};
