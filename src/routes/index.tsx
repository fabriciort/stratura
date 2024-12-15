import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../pages/dashboard';
import { PessoasPage } from '../pages/pessoas';
import { EventosPage } from '../pages/eventos';
import { EscalasPage } from '../pages/escalas';
import { RelatoriosPage } from '../pages/relatorios';
import { LoginPage } from '../pages/login';
import { useAuth } from '../contexts/AuthContext';

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
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
} 