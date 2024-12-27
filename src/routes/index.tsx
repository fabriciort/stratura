import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../pages/dashboard';
import { PessoasPage } from '../pages/pessoas';
import { EventosPage } from '../pages/eventos';
import { EscalasPage } from '../pages/escalas';
import { RelatoriosPage } from '../pages/relatorios';
import { ConfiguracoesPage } from '../pages/configuracoes';
import { LoginPage } from '../pages/login';
import { useAuth } from '../contexts/AuthContext';
import { ErrorBoundary } from '../components/ui/error-boundary';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/'} />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/'} />
  },
  {
    path: '/pessoas',
    element: (
      <PrivateRoute>
        <MainLayout>
          <PessoasPage />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/'} />
  },
  {
    path: '/pessoas/novo',
    element: (
      <PrivateRoute>
        <MainLayout>
          <PessoasPage isNew />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/pessoas'} />
  },
  {
    path: '/pessoas/:id',
    element: (
      <PrivateRoute>
        <MainLayout>
          <PessoasPage />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/pessoas'} />
  },
  {
    path: '/eventos',
    element: (
      <PrivateRoute>
        <MainLayout>
          <EventosPage />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/'} />
  },
  {
    path: '/eventos/novo',
    element: (
      <PrivateRoute>
        <MainLayout>
          <EventosPage isNew />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/eventos'} />
  },
  {
    path: '/eventos/:id',
    element: (
      <PrivateRoute>
        <MainLayout>
          <EventosPage />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/eventos'} />
  },
  {
    path: '/escalas',
    element: (
      <PrivateRoute>
        <MainLayout>
          <EscalasPage />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/'} />
  },
  {
    path: '/relatorios',
    element: (
      <PrivateRoute>
        <MainLayout>
          <RelatoriosPage />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/'} />
  },
  {
    path: '/configuracoes',
    element: (
      <PrivateRoute>
        <MainLayout>
          <ConfiguracoesPage />
        </MainLayout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('Página não encontrada')} resetErrorBoundary={() => window.location.href = '/'} />
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
} 