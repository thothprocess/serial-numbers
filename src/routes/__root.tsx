import { Outlet, createRootRoute } from '@tanstack/react-router';
import { ApplicationHeader } from '@/components/ApplicationHeader';
import { ApplicationFooter } from '@/components/ApplicationFooter';
import { ThemeSelect } from '@/components/ThemeSelect';

export const Route = createRootRoute({
  component: () => (
    <>
      <ApplicationHeader />
      <div className="p-4">
        <div className="flex justify-end space-x-1">
          <ThemeSelect />
        </div>
        <Outlet />
      </div>
      <ApplicationFooter />
    </>
  ),
});
