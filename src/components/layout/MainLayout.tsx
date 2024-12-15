import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificacoesPopover } from '../notificacoes/NotificacoesPopover';
import { ChatDrawer } from '../chat/ChatDrawer';
import { SearchCommand } from './SearchCommand';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

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
  { label: 'Cardápios', path: '/cardapios' },
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                  {item.label}
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
            <NotificacoesPopover />
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="hover:bg-destructive hover:text-destructive-foreground"
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
                  {item.label}
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

      {/* Main content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
} 