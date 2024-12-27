import { ReactNode, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificacoesPopover } from '../notificacoes/NotificacoesPopover';
import { SearchCommand } from './SearchCommand';
import { Menu, X, Calendar, Users, ClipboardList, BarChart2, Settings, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/theme-toggle';
import { ChatDrawer } from '../chat/ChatDrawer';

interface MainLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: typeof BarChart2;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: BarChart2 },
  { label: 'Pessoas', path: '/pessoas', icon: Users },
  { label: 'Eventos', path: '/eventos', icon: Calendar },
  { label: 'Escalas', path: '/escalas', icon: ClipboardList },
  { label: 'Relatórios', path: '/relatorios', icon: BarChart2 },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
];

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Logo - sempre visível */}
          <a href="/" className="mr-4 flex items-center space-x-2">
            <span className="font-bold text-xl">Stratura</span>
          </a>

          {/* Menu para telas médias e grandes */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isCurrentPath(item.path) ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "h-8",
                    isCurrentPath(item.path) ? "font-medium" : "text-muted-foreground"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className="h-4 w-4 md:mr-2" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Botão do menu mobile */}
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Área direita do header */}
          <div className="flex items-center space-x-2">
            <SearchCommand />
            <NotificacoesPopover />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setChatOpen(true)}
            >
              <MessageCircle className="h-5 w-5" />
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

        {/* Menu móvel */}
        <div 
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200 border-t",
            mobileMenuOpen ? "max-h-[400px]" : "max-h-0"
          )}
        >
          <nav className="container py-4">
            <div className="grid gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isCurrentPath(item.path) ? 'default' : 'ghost'}
                    className={cn(
                      "w-full justify-start text-left",
                      isCurrentPath(item.path) ? "font-medium" : "text-muted-foreground"
                    )}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => setChatOpen(true)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>Chat</span>
              </Button>
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

      {/* Chat Drawer */}
      {chatOpen && <ChatDrawer onClose={() => setChatOpen(false)} />}
    </div>
  );
} 