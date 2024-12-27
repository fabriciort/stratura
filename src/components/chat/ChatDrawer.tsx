import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useWhatsapp } from '../../contexts/WhatsappContext';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { MessageSquare, X, Send, Image, Paperclip, Phone, MessageCircle, Plus, Users, Calendar, ArrowLeft, Search } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mensagem } from '../../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatAtual?.mensagens]);

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

  const getChatTitle = () => {
    if (!chatAtual) return 'Chat';
    
    switch (chatAtual.tipo) {
      case 'privado':
        const participante = chatAtual.participantes.find(p => p.id !== chatAtual.participantes[0].id);
        return participante?.nome || 'Chat Privado';
      case 'grupo':
        return chatAtual.nome || 'Chat em Grupo';
      case 'evento':
        const evento = eventos.find(e => String(e.id) === chatAtual.eventoId);
        return evento?.nome || 'Chat do Evento';
      default:
        return 'Chat';
    }
  };

  const getChatInfo = () => {
    if (!chatAtual) return '';

    switch (chatAtual.tipo) {
      case 'privado':
        return 'Chat privado';
      case 'grupo':
        return `${chatAtual.participantes.length} participantes`;
      case 'evento':
        const evento = eventos.find(e => String(e.id) === chatAtual.eventoId);
        return evento ? `${format(new Date(evento.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}` : '';
      default:
        return '';
    }
  };

  const filteredChats = chats.filter(chat => {
    const searchLower = searchTerm.toLowerCase();
    if (chat.tipo === 'privado') {
      const participante = chat.participantes.find(p => p.id !== chat.participantes[0].id);
      return participante?.nome.toLowerCase().includes(searchLower);
    }
    return chat.nome?.toLowerCase().includes(searchLower);
  });

  const renderWelcomeScreen = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
      >
        <MessageSquare className="h-8 w-8 text-primary" />
      </motion.div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Bem-vindo ao Chat</h2>
        <p className="text-muted-foreground">
          Comunique-se com sua equipe, gerencie eventos e mantenha todos atualizados
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">Privado</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chat Privado</DialogTitle>
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
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Grupo</span>
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
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Evento</span>
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
        </motion.div>
      </div>

      {chats.length > 0 && (
        <div className="w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <AnimatePresence>
            <motion.div className="space-y-2 mt-4">
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
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
                        <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {chat.mensagens.filter(m => !m.lida).length}
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>
              </div>
      )}
    </motion.div>
  );

  const renderMensagem = (mensagem: Mensagem) => {
    const isRemetente = mensagem.remetente.id === chatAtual?.participantes[0].id;

    return (
      <motion.div
                    key={mensagem.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isRemetente ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div
          className={cn(
            "max-w-[80%] rounded-2xl p-3",
            isRemetente
              ? "bg-primary text-primary-foreground ml-12"
              : "bg-muted mr-12",
            "shadow-sm hover:shadow-md transition-shadow"
          )}
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
      </motion.div>
    );
  };

  const handleVoltar = () => {
    selecionarChat('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed inset-y-0 right-0 w-full md:w-96 bg-background border-l shadow-xl flex flex-col z-50"
      >
        {/* Cabeçalho */}
        <div className="p-4 border-b flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {chatAtual && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoltar}
                  className="hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h3 className="font-semibold">{getChatTitle()}</h3>
              {config.enabled && chatAtual?.tipo === 'privado' && (
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
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {chatAtual && (
            <p className="text-sm text-muted-foreground">{getChatInfo()}</p>
          )}
        </div>

        {/* Conteúdo */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="p-4">
            {!chatAtual ? (
              renderWelcomeScreen()
            ) : (
              <div className="space-y-4">
                {chatAtual.mensagens.map(renderMensagem)}
              </div>
            )}
          </div>
        </ScrollArea>

          {/* Campo de entrada */}
          {chatAtual && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
              <div className="flex items-center space-x-2">
                <Input
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                className="flex-1 rounded-full bg-muted"
                />
                <Button
                  variant="ghost"
                  size="icon"
                className="hover:bg-accent rounded-full"
                  onClick={() => {/* TODO: Implementar upload de imagem */}}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                className="hover:bg-accent rounded-full"
                  onClick={() => {/* TODO: Implementar upload de arquivo */}}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleEnviarMensagem}
                  disabled={!mensagem.trim()}
                className="rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
          </motion.div>
          )}
      </motion.div>
    </AnimatePresence>
  );
} 