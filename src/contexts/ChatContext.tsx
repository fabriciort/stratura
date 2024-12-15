import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Chat, Mensagem, User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

interface ChatContextType {
  chats: Chat[];
  chatAtual: Chat | null;
  mensagensNaoLidas: number;
  selecionarChat: (chatId: string) => void;
  enviarMensagem: (conteudo: string, tipo: Mensagem['tipo']) => void;
  criarChatPrivado: (participanteId: string) => void;
  criarChatGrupo: (nome: string, participantesIds: string[]) => void;
  criarChatEvento: (eventoId: string) => void;
  marcarMensagensComoLidas: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatAtual, setChatAtual] = useState<Chat | null>(null);
  const { user } = useAuth();

  // Carregar chats do localStorage ao iniciar
  useEffect(() => {
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      const parsedChats = JSON.parse(storedChats).map((chat: any) => ({
        ...chat,
        mensagens: chat.mensagens.map((msg: any) => ({
          ...msg,
          data: new Date(msg.data)
        })),
        participantes: chat.participantes.map((p: any) => ({
          ...p,
          ultimaVisualizacao: p.ultimaVisualizacao ? new Date(p.ultimaVisualizacao) : undefined
        }))
      }));
      setChats(parsedChats);
    }
  }, []);

  // Salvar chats no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const mensagensNaoLidas = chats.reduce((total, chat) => {
    return total + chat.mensagens.filter(m => !m.lida && m.remetente.id !== user?.id).length;
  }, 0);

  const selecionarChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setChatAtual(chat);
      marcarMensagensComoLidas(chatId);
    }
  };

  const enviarMensagem = (conteudo: string, tipo: Mensagem['tipo'] = 'texto') => {
    if (!chatAtual || !user) return;

    const novaMensagem: Mensagem = {
      id: uuidv4(),
      remetente: {
        id: user.id,
        nome: user.name
      },
      conteudo,
      data: new Date(),
      lida: false,
      tipo,
      eventoId: chatAtual.eventoId,
      escalaId: chatAtual.escalaId
    };

    const chatAtualizado = {
      ...chatAtual,
      mensagens: [...chatAtual.mensagens, novaMensagem]
    };

    setChats(chats.map(chat => 
      chat.id === chatAtual.id ? chatAtualizado : chat
    ));
    setChatAtual(chatAtualizado);
  };

  const criarChatPrivado = (participanteId: string) => {
    if (!user) return;

    // Verificar se já existe um chat privado com este participante
    const chatExistente = chats.find(chat => 
      chat.tipo === 'privado' && 
      chat.participantes.some(p => p.id === participanteId)
    );

    if (chatExistente) {
      setChatAtual(chatExistente);
      return;
    }

    const novoChat: Chat = {
      id: uuidv4(),
      tipo: 'privado',
      participantes: [
        {
          id: user.id,
          nome: user.name
        },
        // Aqui você precisará buscar os dados do participante
        {
          id: participanteId,
          nome: 'Nome do Participante' // Substituir pelo nome real
        }
      ],
      mensagens: []
    };

    setChats([...chats, novoChat]);
    setChatAtual(novoChat);
  };

  const criarChatGrupo = (nome: string, participantesIds: string[]) => {
    if (!user) return;

    const novoChat: Chat = {
      id: uuidv4(),
      tipo: 'grupo',
      nome,
      participantes: [
        {
          id: user.id,
          nome: user.name
        },
        // Aqui você precisará buscar os dados dos participantes
        ...participantesIds.map(id => ({
          id,
          nome: 'Nome do Participante' // Substituir pelo nome real
        }))
      ],
      mensagens: []
    };

    setChats([...chats, novoChat]);
    setChatAtual(novoChat);
  };

  const criarChatEvento = (eventoId: string) => {
    if (!user) return;

    const chatExistente = chats.find(chat => 
      chat.tipo === 'evento' && 
      chat.eventoId === eventoId
    );

    if (chatExistente) {
      setChatAtual(chatExistente);
      return;
    }

    const novoChat: Chat = {
      id: uuidv4(),
      tipo: 'evento',
      eventoId,
      participantes: [
        {
          id: user.id,
          nome: user.name
        }
      ],
      mensagens: []
    };

    setChats([...chats, novoChat]);
    setChatAtual(novoChat);
  };

  const marcarMensagensComoLidas = (chatId: string) => {
    if (!user) return;

    setChats(chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          mensagens: chat.mensagens.map(msg => ({
            ...msg,
            lida: msg.remetente.id !== user.id ? true : msg.lida
          })),
          participantes: chat.participantes.map(p => 
            p.id === user.id 
              ? { ...p, ultimaVisualizacao: new Date() }
              : p
          )
        };
      }
      return chat;
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        chatAtual,
        mensagensNaoLidas,
        selecionarChat,
        enviarMensagem,
        criarChatPrivado,
        criarChatGrupo,
        criarChatEvento,
        marcarMensagensComoLidas,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
} 