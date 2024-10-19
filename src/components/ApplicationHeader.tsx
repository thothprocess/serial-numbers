import React from 'react';
import { Link } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ApplicationHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  version?: string;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  className,
  ...props
}) => {
  return (
    <header
      className={cn('flex flex-col items-center space-y-1 my-4', className)}
      {...props}
    >
      <Link to="/">
        <h1 className="text-5xl">
          {props.name || import.meta.env.VITE_APP_NAME || 'WP Boilerplate'}
        </h1>
      </Link>
      <Badge variant="outline">
        {props.version || import.meta.env.VITE_APP_VERSION || '0.1.0'}
      </Badge>
    </header>
  );
};
