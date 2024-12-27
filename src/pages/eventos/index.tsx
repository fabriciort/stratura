import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { EventoForm } from '../../components/eventos/EventoForm';
import { EventosList } from '../../components/eventos/EventosList';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { Evento } from '../../types';
import { Dialog, DialogContent } from '../../components/ui/dialog';

interface EventosPageProps {
  isNew?: boolean;
}

export function EventosPage({ isNew }: EventosPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { eventos } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(isNew || false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | undefined>();

  useEffect(() => {
    if (id) {
      const evento = eventos.find(e => e.id === Number(id));
      if (evento) {
        setSelectedEvento(evento);
      } else {
        navigate('/eventos');
      }
    }
  }, [id, eventos, navigate]);

  const handleNovoEvento = () => {
    setSelectedEvento(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (evento: Evento) => {
    setSelectedEvento(evento);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEvento(undefined);
    if (isNew) {
      navigate('/eventos');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie seus eventos e escalas
          </p>
        </div>
        <Button onClick={handleNovoEvento} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      <EventosList onEdit={handleEdit} />

      {/* Modal do formulário de evento */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <EventoForm 
            evento={selectedEvento}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 