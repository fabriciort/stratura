import { useState } from 'react';
import { useNotificacoes } from '../../contexts/NotificacoesContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Bell, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NotificacoesPopover() {
  const {
    notificacoes,
    notificacoesNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    limparNotificacoes
  } = useNotificacoes();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificacaoClick = (id: string, link: string) => {
    marcarComoLida(id);
    navigate(link);
    setIsOpen(false);
  };

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case 'evento_novo':
      case 'evento_atualizado':
      case 'lembrete_evento':
        return '🗓️';
      case 'escala_nova':
      case 'escala_atualizada':
      case 'escala_confirmacao':
        return '👥';
      case 'cardapio_novo':
      case 'cardapio_atualizado':
        return '🍽️';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {notificacoesNaoLidas > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            {notificacoesNaoLidas}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 z-50 w-96 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Notificações</h3>
              <div className="flex space-x-2">
                {notificacoesNaoLidas > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => marcarTodasComoLidas()}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Marcar todas como lidas
                  </Button>
                )}
                {notificacoes.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => limparNotificacoes()}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {notificacoes.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Nenhuma notificação
                </div>
              ) : (
                notificacoes.map(notificacao => (
                  <div
                    key={notificacao.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notificacao.lida
                        ? 'bg-secondary/30 hover:bg-secondary/50'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    onClick={() => handleNotificacaoClick(notificacao.id, notificacao.link || '/')}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-xl">
                        {getIconePorTipo(notificacao.tipo)}
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notificacao.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          {notificacao.mensagem}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notificacao.data), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                      {!notificacao.lida && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {notificacoes.length > 5 && (
              <div className="mt-2 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const container = document.querySelector('.overflow-y-auto');
                    if (container) {
                      container.scrollTop = container.scrollHeight;
                    }
                  }}
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Ver mais antigas
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
} 