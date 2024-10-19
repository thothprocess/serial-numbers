import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createRouter,
  createHashHistory,
  Link,
} from '@tanstack/react-router';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import { PageLoader } from '@/components/PageLoader';
import { routeTree } from '@/routeTree.gen';
import '@/index.css';

const queryClient = new QueryClient();

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultNotFoundComponent: () => {
    return (
      <div>
        <p>Not found!</p>
        <Link to="/">Go home</Link>
      </div>
    );
  },
  defaultPendingComponent: () => (
    <>
      <PageLoader />
    </>
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
