import { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useWhatsapp } from '../../contexts/WhatsappContext';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { MessageSquare, X, Send, Image, Paperclip, Phone, MessageCircle, Plus, Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mensagem } from '../../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ChatDrawerProps {
  onClose: () => void;
}

export function ChatDrawer({ onClose }: ChatDrawerProps) {
  const {
    chats,
    chatAtual,
    mensagensNaoLidas,
    selecionarChat,
    enviarMensagem,
    criarChatPrivado,
    criarChatGrupo,
    criarChatEvento
  } = useChat();
  const { config, enviarMensagemWhatsapp } = useWhatsapp();
  const { pessoas, eventos } = useApp();
  const [mensagem, setMensagem] = useState('');
  const [novoGrupoNome, setNovoGrupoNome] = useState('');
  const [participantesSelecionados, setParticipantesSelecionados] = useState<string[]>([]);

  const handleEnviarMensagem = async () => {
    if (!mensagem.trim()) return;

    // Enviar mensagem no chat interno
    enviarMensagem(mensagem, 'texto');

    // Se o WhatsApp estiver habilitado e for um chat privado, enviar também por WhatsApp
    if (config.enabled && chatAtual?.tipo === 'privado') {
      const participante = chatAtual.participantes.find(p => p.id !== chatAtual.participantes[0].id);
      if (participante) {
        try {
          await enviarMensagemWhatsapp(participante.id, mensagem);
        } catch (error) {
          console.error('Erro ao enviar mensagem WhatsApp:', error);
        }
      }
    }

    setMensagem('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleCriarGrupo = () => {
    if (novoGrupoNome && participantesSelecionados.length > 0) {
      criarChatGrupo(novoGrupoNome, participantesSelecionados);
      setNovoGrupoNome('');
      setParticipantesSelecionados([]);
    }
  };

  const renderMensagem = (mensagem: Mensagem) => {
    const isRemetente = mensagem.remetente.id === chatAtual?.participantes[0].id;

    return (
      <div
        key={mensagem.id}
        className={`flex ${isRemetente ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-3 ${
            isRemetente
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-sm font-medium">
              {mensagem.remetente.nome}
            </p>
            {mensagem.tipo === 'whatsapp' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Phone className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mensagem do WhatsApp</p>
                    {mensagem.whatsappStatus && (
                      <p className="text-xs opacity-70">
                        Status: {mensagem.whatsappStatus}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-sm break-words">{mensagem.conteudo}</p>
          <p className="text-xs opacity-70 mt-1">
            {formatDistanceToNow(mensagem.data, {
              addSuffix: true,
              locale: ptBR
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-background border-l shadow-xl flex flex-col z-50">
      {/* Cabeçalho */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-semibold">Chat</h3>
          {config.enabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Phone className="h-4 w-4 text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>WhatsApp conectado</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!chatAtual && (
            <>
              {/* Novo Chat Privado */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Chat</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    {pessoas.map(pessoa => (
                      <Button
                        key={pessoa.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => criarChatPrivado(String(pessoa.id))}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {pessoa.nome}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Novo Grupo */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Grupo</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <Input
                      placeholder="Nome do grupo"
                      value={novoGrupoNome}
                      onChange={e => setNovoGrupoNome(e.target.value)}
                    />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Participantes</p>
                      {pessoas.map(pessoa => (
                        <div key={pessoa.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`pessoa-${pessoa.id}`}
                            checked={participantesSelecionados.includes(String(pessoa.id))}
                            onChange={e => {
                              if (e.target.checked) {
                                setParticipantesSelecionados([...participantesSelecionados, String(pessoa.id)]);
                              } else {
                                setParticipantesSelecionados(participantesSelecionados.filter(id => id !== String(pessoa.id)));
                              }
                            }}
                          />
                          <label htmlFor={`pessoa-${pessoa.id}`}>{pessoa.nome}</label>
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleCriarGrupo} disabled={!novoGrupoNome || participantesSelecionados.length === 0}>
                      Criar Grupo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Chat de Evento */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chat de Evento</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    {eventos.map(evento => (
                      <Button
                        key={evento.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => criarChatEvento(String(evento.id))}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {evento.nome}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista de chats ou mensagens */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {!chatAtual ? (
            // Lista de chats
            <div className="space-y-2">
              {chats.map(chat => (
                <Card
                  key={chat.id}
                  className="p-3 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => selecionarChat(chat.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {chat.tipo === 'privado' && <MessageCircle className="h-4 w-4" />}
                      {chat.tipo === 'grupo' && <Users className="h-4 w-4" />}
                      {chat.tipo === 'evento' && <Calendar className="h-4 w-4" />}
                      {chat.whatsappGroupId && (
                        <Phone className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {chat.tipo === 'privado'
                            ? chat.participantes.find(p => p.id !== chat.participantes[0].id)?.nome
                            : chat.nome || 'Chat em grupo'}
                        </p>
                        {chat.mensagens.length > 0 && (
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.mensagens[chat.mensagens.length - 1].conteudo}
                          </p>
                        )}
                      </div>
                    </div>
                    {chat.mensagens.filter(m => !m.lida).length > 0 && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // Mensagens do chat atual
            <div className="space-y-4">
              {chatAtual.mensagens.map(renderMensagem)}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Campo de entrada */}
      {chatAtual && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* TODO: Implementar upload de imagem */}}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* TODO: Implementar upload de arquivo */}}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleEnviarMensagem}
              disabled={!mensagem.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 