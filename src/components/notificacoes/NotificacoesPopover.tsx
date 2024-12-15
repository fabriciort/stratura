import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificacoes } from '../../contexts/NotificacoesContext';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';
import { NotificacaoTipo } from '../../types';

export function NotificacoesPopover() {
  const navigate = useNavigate();
  const { notificacoes, markAsRead, markAllAsRead, deleteNotificacao, getNotificacaoLink } = useNotificacoes();
  const [open, setOpen] = useState(false);

  const getNotificacaoIcon = (tipo: NotificacaoTipo) => {
    switch (tipo) {
      case 'evento_novo':
      case 'evento_atualizado':
      case 'lembrete_evento':
        return '📅';
      case 'escala_nova':
      case 'escala_atualizada':
      case 'escala_confirmacao':
        return '📋';
      default:
        return '🔔';
    }
  };

  const handleNotificacaoClick = (id: string, tipo: NotificacaoTipo, dadosAdicionais?: Record<string, string>) => {
    markAsRead(id);
    setOpen(false);
    navigate(getNotificacaoLink(tipo, dadosAdicionais));
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificacoesNaoLidas > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {notificacoesNaoLidas}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-semibold">Notificações</h4>
          {notificacoesNaoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => markAllAsRead()}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notificacoes.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            notificacoes.map((notificacao) => (
              <div
                key={notificacao.id}
                className={`flex items-start gap-3 border-b p-3 transition-colors hover:bg-accent cursor-pointer ${
                  !notificacao.lida ? 'bg-accent/50' : ''
                }`}
                onClick={() => handleNotificacaoClick(notificacao.id, notificacao.tipo, notificacao.dadosAdicionais)}
              >
                <span className="mt-0.5 text-lg">
                  {getNotificacaoIcon(notificacao.tipo)}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notificacao.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {notificacao.mensagem}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notificacao.data).toLocaleString('pt-BR')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotificacao(notificacao.id);
                  }}
                >
                  ×
                </Button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 