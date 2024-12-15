import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { EventoForm } from '../../components/eventos/EventoForm';
import { EventosList } from '../../components/eventos/EventosList';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

interface EventosPageProps {
  isNew?: boolean;
}

export function EventosPage({ isNew }: EventosPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { eventos } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);

  useEffect(() => {
    if (isNew) {
      setShowForm(true);
      setSelectedEvento(null);
    } else if (id) {
      const evento = eventos.find(e => e.id === id);
      if (evento) {
        setShowForm(true);
        setSelectedEvento(evento);
      } else {
        navigate('/eventos');
      }
    }
  }, [isNew, id, eventos, navigate]);

  const handleEdit = (evento: any) => {
    navigate(`/eventos/${evento.id}`);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedEvento(null);
    navigate('/eventos');
  };

  if (showForm) {
    return <EventoForm evento={selectedEvento} onClose={handleClose} />;
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

      <EventosList onEdit={handleEdit} />
    </div>
  );
} 