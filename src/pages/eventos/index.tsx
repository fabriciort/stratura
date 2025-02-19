import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { EventoForm } from '../../components/eventos/EventoForm';
import { EventosList } from '../../components/eventos/EventosList';
import { EventoDetails } from '../../components/eventos/EventoDetails';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { Evento } from '../../types';

interface EventosPageProps {
  isNew?: boolean;
}

export function EventosPage({ isNew }: EventosPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { eventos } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  useEffect(() => {
    if (isNew) {
      setShowForm(true);
      setSelectedEvento(null);
    } else if (id) {
      const evento = eventos.find(e => e.id === Number(id));
      if (evento) {
        setSelectedEvento(evento);
      } else {
        navigate('/eventos');
      }
    }
  }, [isNew, id, eventos, navigate]);

  const handleEdit = (evento: Evento) => {
    setShowForm(true);
    setSelectedEvento(evento);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedEvento(null);
    navigate('/eventos');
  };

  const handleAddEscala = () => {
    if (selectedEvento) {
      navigate(`/escalas/novo?eventoId=${selectedEvento.id}`);
    }
  };

  if (showForm) {
    return <EventoForm evento={selectedEvento} onClose={handleClose} />;
  }

  if (selectedEvento && !showForm) {
    return (
      <EventoDetails
        evento={selectedEvento}
        onEdit={() => setShowForm(true)}
        onAddEscala={handleAddEscala}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie os eventos e suas características
          </p>
        </div>
        <Button onClick={() => navigate('/eventos/novo')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      <EventosList onEdit={(evento) => navigate(`/eventos/${evento.id}`)} />
    </div>
  );
} 