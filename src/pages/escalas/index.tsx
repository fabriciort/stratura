import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { EscalasList } from '../../components/escalas/EscalasList';
import { EscalaForm } from '../../components/escalas/EscalaForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { Escala } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';

export function EscalasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventos } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEventoSelectorOpen, setIsEventoSelectorOpen] = useState(false);
  const [selectedEscala, setSelectedEscala] = useState<Escala | undefined>(undefined);
  const [selectedEventoId, setSelectedEventoId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventoId = params.get('eventoId');
    if (eventoId) {
      setSelectedEventoId(eventoId);
      setIsFormOpen(true);
    }
  }, [location]);

  const handleOpenForm = (escala?: Escala, eventoId?: string) => {
    setSelectedEscala(escala);
    setSelectedEventoId(eventoId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedEscala(undefined);
    setSelectedEventoId(undefined);
    setIsFormOpen(false);
    // Se veio de um evento, volta para a página do evento
    const params = new URLSearchParams(location.search);
    if (params.has('eventoId')) {
      navigate('/eventos');
    }
  };

  const handleNovaEscala = () => {
    setIsEventoSelectorOpen(true);
  };

  const handleEventoSelecionado = (eventoId: string) => {
    setSelectedEventoId(eventoId);
    setIsEventoSelectorOpen(false);
    setIsFormOpen(true);
  };

  // Filtra eventos que ainda não têm escala
  const eventosDisponiveis = eventos.filter(evento => 
    evento.status !== 'cancelado' && !evento.escala
  ).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escalas</h1>
          <p className="text-muted-foreground">
            Gerencie as escalas dos eventos
          </p>
        </div>
        <Button onClick={handleNovaEscala} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Escala
        </Button>
      </div>

      <EscalasList onEdit={handleOpenForm} />

      {/* Modal de seleção de evento */}
      <Dialog open={isEventoSelectorOpen} onOpenChange={setIsEventoSelectorOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selecionar Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Evento</Label>
              <Select onValueChange={handleEventoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventosDisponiveis.length > 0 ? (
                    eventosDisponiveis.map((evento) => (
                      <SelectItem key={evento.id} value={evento.id.toString()}>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{evento.nome} - {new Date(evento.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Não há eventos disponíveis para criar escala
                    </div>
                  )}
                </SelectContent>
              </Select>
              {eventosDisponiveis.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Todos os eventos já possuem escalas ou estão cancelados.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal do formulário de escala */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <EscalaForm 
            escala={selectedEscala} 
            eventoId={selectedEventoId}
            onClose={handleCloseForm} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 