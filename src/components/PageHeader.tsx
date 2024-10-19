import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  className,
  ...props
}: PageHeaderProps) => {
  return (
    <>
      <div className={cn('space-y-4', className)} {...props}>
        <h2 className="text-4xl">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </>
  );
};
