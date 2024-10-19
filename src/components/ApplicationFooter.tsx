import React from 'react';
import { cn } from '@/lib/utils';

interface ApplicationHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ApplicationFooter: React.FC = ({
  className,
  ...props
}: ApplicationHeaderProps) => {
  return (
    <footer
      className={cn('flex flex-col space-y-1 mt-8 mx-4 mb-2', className)}
      {...props}
    >
      <p className="text-balance text-xs leading-loose md:text-left">
        Built by{' '}
        <a
          href="https://thothprocess.com/"
          target="\_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          ThothProcess
        </a>
      </p>
    </footer>
  );
};
