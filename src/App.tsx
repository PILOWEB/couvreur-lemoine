import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router';
import { AppReadyProvider } from '@/hooks/useAppReady';
import { useLenis } from '@/hooks/useLenis';
import { useAscension } from '@/hooks/useAscension';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileCallBar } from '@/components/layout/MobileCallBar';
import { Preloader } from '@/components/layout/Preloader';
import { Cursor } from '@/components/ui/Cursor';
import { Home } from '@/pages/Home';

const ServicePage = lazy(() => import('@/pages/ServicePage').then((m) => ({ default: m.ServicePage })));
const Mentions = lazy(() => import('@/pages/Mentions').then((m) => ({ default: m.Mentions })));

function Layout() {
  useLenis();
  useAscension();
  return (
    <AppReadyProvider>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-ink focus:px-4 focus:py-2 focus:text-ink-inverse">
        Aller au contenu
      </a>
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden />
      <Header />
      <main id="contenu">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileCallBar />
      <ScrollRestoration />
    </AppReadyProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services/:slug', element: <ServicePage /> },
      { path: '/mentions-legales', element: <Mentions /> },
      { path: '*', element: <Home /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
