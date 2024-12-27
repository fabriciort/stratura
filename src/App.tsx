import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import { NotificacoesProvider } from './contexts/NotificacoesContext'
import { ChatProvider } from './contexts/ChatContext'
import { WhatsappProvider } from './contexts/WhatsappContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Routes } from './routes'
import { Toaster } from './components/ui/toaster'
import { TooltipProvider } from './components/ui/tooltip'
import './styles/globals.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <NotificacoesProvider>
            <ChatProvider>
              <WhatsappProvider>
                <TooltipProvider>
                  <Routes />
                  <Toaster />
                </TooltipProvider>
              </WhatsappProvider>
            </ChatProvider>
          </NotificacoesProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
