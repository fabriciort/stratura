import { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { MessageSquare, X, Send, Image, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ChatDrawer() {
  const {
    chats,
    chatAtual,
    mensagensNaoLidas,
    selecionarChat,
    enviarMensagem
  } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleEnviarMensagem = () => {
    if (!mensagem.trim()) return;
    enviarMensagem(mensagem, 'texto');
    setMensagem('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <Button
        className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
        {mensagensNaoLidas > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
            {mensagensNaoLidas}
          </span>
        )}
      </Button>

      {/* Gaveta de chat */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-background border-l shadow-xl flex flex-col z-50">
          {/* Cabeçalho */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Chat</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Lista de chats ou mensagens */}
          <div className="flex-1 overflow-y-auto p-4">
            {!chatAtual ? (
              // Lista de chats
              <div className="space-y-2">
                {chats.map(chat => (
                  <Card
                    key={chat.id}
                    className="p-3 cursor-pointer hover:bg-accent"
                    onClick={() => selecionarChat(chat.id)}
                  >
                    <div className="flex items-center justify-between">
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
                {chatAtual.mensagens.map(mensagem => (
                  <div
                    key={mensagem.id}
                    className={`flex ${
                      mensagem.remetente.id === chatAtual.participantes[0].id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        mensagem.remetente.id === chatAtual.participantes[0].id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {mensagem.remetente.nome}
                      </p>
                      <p className="text-sm">{mensagem.conteudo}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatDistanceToNow(mensagem.data, {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
      )}
    </>
  );
} 