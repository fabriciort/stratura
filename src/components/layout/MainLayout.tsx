import { ReactNode, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificacoesPopover } from '../notificacoes/NotificacoesPopover';
import { SearchCommand } from './SearchCommand';
import { Menu, X, Calendar, Users, ClipboardList, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/theme-toggle';

interface MainLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Pessoas', path: '/pessoas' },
  { label: 'Eventos', path: '/eventos' },
  { label: 'Escalas', path: '/escalas' },
  { label: 'Relatórios', path: '/relatorios' },
];

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const getMenuIcon = (label: string) => {
    switch (label) {
      case 'Dashboard':
        return <BarChart2 className="h-4 w-4" />;
      case 'Pessoas':
        return <Users className="h-4 w-4" />;
      case 'Eventos':
        return <Calendar className="h-4 w-4" />;
      case 'Escalas':
        return <ClipboardList className="h-4 w-4" />;
      case 'Relatórios':
        return <BarChart2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">Stratura</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  variant={isCurrentPath(item.path) ? 'default' : 'ghost'}
                  className={cn(
                    "h-8",
                    isCurrentPath(item.path) ? "font-medium" : "text-muted-foreground"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="flex items-center space-x-2">
                    {getMenuIcon(item.label)}
                    <span>{item.label}</span>
                  </span>
                </Button>
              ))}
            </nav>
          </div>

          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <SearchCommand />
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={logout}
              >
                <span className="sr-only">Sair</span>
              </Button>
              <Button
                variant="ghost"
                className="hidden md:flex hover:bg-destructive hover:text-destructive-foreground"
                onClick={logout}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Menu móvel */}
        <div 
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200 border-t",
            mobileMenuOpen ? "max-h-[400px]" : "max-h-0"
          )}
        >
          <nav className="container py-4">
            <div className="grid gap-2">
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  variant={isCurrentPath(item.path) ? 'default' : 'ghost'}
                  className={cn(
                    "w-full justify-start text-left",
                    isCurrentPath(item.path) ? "font-medium" : "text-muted-foreground"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="flex items-center space-x-2">
                    {getMenuIcon(item.label)}
                    <span>{item.label}</span>
                  </span>
                </Button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="w-full hover:bg-destructive hover:text-destructive-foreground"
              >
                Sair
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container py-6">
        {children}
      </main>
    </div>
  );
} 