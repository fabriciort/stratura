import { createContext, useContext, useState, ReactNode } from 'react';
import { Notificacao, NotificacaoTipo } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NotificacoesContextType {
  notificacoes: Notificacao[];
  addNotificacao: (notificacao: Omit<Notificacao, 'id' | 'data' | 'lida'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotificacao: (id: string) => void;
  getNotificacaoLink: (tipo: NotificacaoTipo, dadosAdicionais?: Record<string, string>) => string;
}

export const NotificacoesContext = createContext<NotificacoesContextType>({} as NotificacoesContextType);

interface NotificacoesProviderProps {
  children: ReactNode;
}

export function NotificacoesProvider({ children }: NotificacoesProviderProps) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  const addNotificacao = (notificacao: Omit<Notificacao, 'id' | 'data' | 'lida'>) => {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: uuidv4(),
      data: new Date(),
      lida: false
    };
    setNotificacoes(prev => [novaNotificacao, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotificacoes(prev =>
      prev.map(notificacao =>
        notificacao.id === id
          ? { ...notificacao, lida: true }
          : notificacao
      )
    );
  };

  const markAllAsRead = () => {
    setNotificacoes(prev =>
      prev.map(notificacao => ({ ...notificacao, lida: true }))
    );
  };

  const deleteNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(notificacao => notificacao.id !== id));
  };

  const getNotificacaoLink = (tipo: NotificacaoTipo, dadosAdicionais?: Record<string, string>): string => {
    switch (tipo) {
      case 'evento_novo':
      case 'evento_atualizado':
        return dadosAdicionais?.eventoId ? `/eventos/${dadosAdicionais.eventoId}` : '/eventos';
      case 'escala_nova':
      case 'escala_atualizada':
      case 'escala_confirmacao':
        return dadosAdicionais?.escalaId ? `/escalas/${dadosAdicionais.escalaId}` : '/escalas';
      case 'lembrete_evento':
        return dadosAdicionais?.eventoId ? `/eventos/${dadosAdicionais.eventoId}` : '/eventos';
      default:
        return '/';
    }
  };

  return (
    <NotificacoesContext.Provider
      value={{
        notificacoes,
        addNotificacao,
        markAsRead,
        markAllAsRead,
        deleteNotificacao,
        getNotificacaoLink,
      }}
    >
      {children}
    </NotificacoesContext.Provider>
  );
}

export const useNotificacoes = () => {
  const context = useContext(NotificacoesContext);
  if (!context) {
    throw new Error('useNotificacoes deve ser usado dentro de um NotificacoesProvider');
  }
  return context;
}; 