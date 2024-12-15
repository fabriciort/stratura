import { useState } from 'react';
import { EventosList } from '../../components/eventos/EventosList';
import { EventoForm } from '../../components/eventos/EventoForm';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Evento } from '../../types';

export function EventosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | undefined>(undefined);

  const handleOpenForm = (evento?: Evento) => {
    setSelectedEvento(evento);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedEvento(undefined);
    setIsFormOpen(false);
  };

  return (
    <>
      <EventosList onEdit={handleOpenForm} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <EventoForm evento={selectedEvento} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </>
  );
} 