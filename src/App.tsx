import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import { NotificacoesProvider } from './contexts/NotificacoesContext'
import { ChatProvider } from './contexts/ChatContext'
import { Routes } from './routes'
import { Toaster } from './components/ui/toaster'
import './styles/globals.css'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NotificacoesProvider>
          <ChatProvider>
            <Routes />
            <Toaster />
          </ChatProvider>
        </NotificacoesProvider>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
