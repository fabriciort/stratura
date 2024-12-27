import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WhatsappConfig, Mensagem } from '../types';
import { useApp } from './AppContext';
import { useChat } from './ChatContext';
import { useNotificacoes } from './NotificacoesContext';

interface WhatsappContextType {
  config: WhatsappConfig;
  updateConfig: (newConfig: Partial<WhatsappConfig>) => void;
  enviarMensagemWhatsapp: (telefone: string, mensagem: string) => Promise<void>;
  criarGrupoWhatsapp: (nome: string, telefones: string[]) => Promise<string>;
  enviarMensagemGrupo: (groupId: string, mensagem: string) => Promise<void>;
  sincronizarMensagens: () => Promise<void>;
}

const WhatsappContext = createContext<WhatsappContextType | undefined>(undefined);

export function WhatsappProvider({ children }: { children: ReactNode }) {
  const { eventos, pessoas } = useApp();
  const { addNotificacao } = useNotificacoes();
  const { enviarMensagem } = useChat();
  const [config, setConfig] = useState<WhatsappConfig>({
    enabled: false,
    notifyOnNewEvent: true,
    notifyOnEscalaUpdate: true,
    notifyBeforeEvento: true,
    horasAntesEvento: 24
  });

  // Carregar configuração do localStorage
  useEffect(() => {
    const storedConfig = localStorage.getItem('whatsappConfig');
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
    }
  }, []);

  // Salvar configuração no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('whatsappConfig', JSON.stringify(config));
  }, [config]);

  // Monitorar eventos próximos para enviar notificações
  useEffect(() => {
    if (!config.enabled || !config.notifyBeforeEvento) return;

    const checkEventosProximos = () => {
      const agora = new Date();
      eventos.forEach(evento => {
        const dataEvento = new Date(evento.data);
        const horasAteEvento = (dataEvento.getTime() - agora.getTime()) / (1000 * 60 * 60);

        if (horasAteEvento <= config.horasAntesEvento && horasAteEvento > 0) {
          // Notificar pessoas escaladas
          evento.pessoasEscaladas?.forEach(pessoa => {
            const pessoaCompleta = pessoas.find(p => p.id === pessoa.id);
            if (pessoaCompleta?.telefone) {
              enviarMensagemWhatsapp(
                pessoaCompleta.telefone,
                `Lembrete: Você está escalado(a) para o evento "${evento.nome}" amanhã às ${evento.horarioInicio}. Local: ${evento.local}`
              );
            }
          });
        }
      });
    };

    const interval = setInterval(checkEventosProximos, 1000 * 60 * 60); // Verificar a cada hora
    return () => clearInterval(interval);
  }, [config, eventos, pessoas]);

  const updateConfig = (newConfig: Partial<WhatsappConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const enviarMensagemWhatsapp = async (telefone: string, mensagem: string) => {
    if (!config.enabled || !config.apiKey) {
      throw new Error('WhatsApp não está configurado');
    }

    try {
      // Aqui você implementaria a chamada real para a API do WhatsApp
      // Por enquanto, vamos apenas simular o envio
      console.log(`Enviando mensagem para ${telefone}: ${mensagem}`);

      // Criar uma mensagem no sistema
      const novaMensagem: Omit<Mensagem, 'id' | 'data'> = {
        remetente: {
          id: 'sistema',
          nome: 'Sistema'
        },
        conteudo: mensagem,
        tipo: 'whatsapp',
        lida: false,
        whatsappStatus: 'enviada'
      };

      enviarMensagem(novaMensagem.conteudo, novaMensagem.tipo);

      addNotificacao({
        tipo: 'evento_novo',
        titulo: 'Mensagem WhatsApp enviada',
        mensagem: `Mensagem enviada para ${telefone}`
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      throw error;
    }
  };

  const criarGrupoWhatsapp = async (nome: string, telefones: string[]): Promise<string> => {
    if (!config.enabled || !config.apiKey) {
      throw new Error('WhatsApp não está configurado');
    }

    try {
      // Aqui você implementaria a chamada real para a API do WhatsApp
      // Por enquanto, vamos apenas simular a criação do grupo
      const groupId = `group_${Date.now()}`;
      console.log(`Criando grupo "${nome}" com ${telefones.length} participantes`);

      addNotificacao({
        tipo: 'evento_novo',
        titulo: 'Grupo WhatsApp criado',
        mensagem: `Grupo "${nome}" criado com sucesso`
      });

      return groupId;
    } catch (error) {
      console.error('Erro ao criar grupo WhatsApp:', error);
      throw error;
    }
  };

  const enviarMensagemGrupo = async (groupId: string, mensagem: string) => {
    if (!config.enabled || !config.apiKey) {
      throw new Error('WhatsApp não está configurado');
    }

    try {
      // Aqui você implementaria a chamada real para a API do WhatsApp
      // Por enquanto, vamos apenas simular o envio
      console.log(`Enviando mensagem para o grupo ${groupId}: ${mensagem}`);

      // Criar uma mensagem no sistema
      const novaMensagem: Omit<Mensagem, 'id' | 'data'> = {
        remetente: {
          id: 'sistema',
          nome: 'Sistema'
        },
        conteudo: mensagem,
        tipo: 'whatsapp',
        lida: false,
        whatsappStatus: 'enviada'
      };

      enviarMensagem(novaMensagem.conteudo, novaMensagem.tipo);

      addNotificacao({
        tipo: 'evento_novo',
        titulo: 'Mensagem WhatsApp enviada',
        mensagem: `Mensagem enviada para o grupo`
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem para o grupo:', error);
      throw error;
    }
  };

  const sincronizarMensagens = async () => {
    if (!config.enabled || !config.apiKey) {
      throw new Error('WhatsApp não está configurado');
    }

    try {
      // Aqui você implementaria a sincronização real com a API do WhatsApp
      // Por enquanto, vamos apenas simular a sincronização
      console.log('Sincronizando mensagens do WhatsApp');

      addNotificacao({
        tipo: 'evento_novo',
        titulo: 'Sincronização WhatsApp',
        mensagem: 'Mensagens sincronizadas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao sincronizar mensagens:', error);
      throw error;
    }
  };

  return (
    <WhatsappContext.Provider
      value={{
        config,
        updateConfig,
        enviarMensagemWhatsapp,
        criarGrupoWhatsapp,
        enviarMensagemGrupo,
        sincronizarMensagens,
      }}
    >
      {children}
    </WhatsappContext.Provider>
  );
}

export function useWhatsapp() {
  const context = useContext(WhatsappContext);
  if (context === undefined) {
    throw new Error('useWhatsapp deve ser usado dentro de um WhatsappProvider');
  }
  return context;
} 