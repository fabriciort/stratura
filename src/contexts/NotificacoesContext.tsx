import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notificacao, NotificacaoTipo } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NotificacoesContextType {
  notificacoes: Notificacao[];
  notificacoesNaoLidas: number;
  adicionarNotificacao: (tipo: NotificacaoTipo, titulo: string, mensagem: string, dadosAdicionais?: Notificacao['dadosAdicionais']) => void;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  limparNotificacoes: () => void;
}

const NotificacoesContext = createContext<NotificacoesContextType | undefined>(undefined);

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  // Carregar notificações do localStorage ao iniciar
  useEffect(() => {
    const storedNotificacoes = localStorage.getItem('notificacoes');
    if (storedNotificacoes) {
      const parsedNotificacoes = JSON.parse(storedNotificacoes).map((n: any) => ({
        ...n,
        data: new Date(n.data)
      }));
      setNotificacoes(parsedNotificacoes);
    }
  }, []);

  // Salvar notificações no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
  }, [notificacoes]);

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  const adicionarNotificacao = (
    tipo: NotificacaoTipo,
    titulo: string,
    mensagem: string,
    dadosAdicionais?: Notificacao['dadosAdicionais']
  ) => {
    const novaNotificacao: Notificacao = {
      id: uuidv4(),
      tipo,
      titulo,
      mensagem,
      lida: false,
      data: new Date(),
      dadosAdicionais,
      link: gerarLink(tipo, dadosAdicionais)
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);

    // Mostrar notificação nativa do navegador se permitido
    if (Notification.permission === 'granted') {
      new Notification(titulo, {
        body: mensagem,
        icon: '/icon.png' // Adicionar ícone apropriado
      });
    }
  };

  const gerarLink = (tipo: NotificacaoTipo, dadosAdicionais?: Notificacao['dadosAdicionais']): string => {
    switch (tipo) {
      case 'evento_novo':
      case 'evento_atualizado':
        return dadosAdicionais?.eventoId ? `/eventos/${dadosAdicionais.eventoId}` : '/eventos';
      case 'escala_nova':
      case 'escala_atualizada':
      case 'escala_confirmacao':
        return dadosAdicionais?.escalaId ? `/escalas/${dadosAdicionais.escalaId}` : '/escalas';
      case 'cardapio_novo':
      case 'cardapio_atualizado':
        return dadosAdicionais?.cardapioId ? `/cardapios/${dadosAdicionais.cardapioId}` : '/cardapios';
      case 'lembrete_evento':
        return dadosAdicionais?.eventoId ? `/eventos/${dadosAdicionais.eventoId}` : '/eventos';
      default:
        return '/';
    }
  };

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(notificacao =>
        notificacao.id === id
          ? { ...notificacao, lida: true }
          : notificacao
      )
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev =>
      prev.map(notificacao => ({ ...notificacao, lida: true }))
    );
  };

  const limparNotificacoes = () => {
    setNotificacoes([]);
  };

  // Solicitar permissão para notificações ao iniciar
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificacoesContext.Provider
      value={{
        notificacoes,
        notificacoesNaoLidas,
        adicionarNotificacao,
        marcarComoLida,
        marcarTodasComoLidas,
        limparNotificacoes,
      }}
    >
      {children}
    </NotificacoesContext.Provider>
  );
}

export function useNotificacoes() {
  const context = useContext(NotificacoesContext);
  if (context === undefined) {
    throw new Error('useNotificacoes deve ser usado dentro de um NotificacoesProvider');
  }
  return context;
} 