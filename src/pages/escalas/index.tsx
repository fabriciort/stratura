import { useState } from 'react';
import { EscalasList } from '../../components/escalas/EscalasList';
import { EscalaForm } from '../../components/escalas/EscalaForm';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Escala } from '../../types';

export function EscalasPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEscala, setSelectedEscala] = useState<Escala | undefined>(undefined);
  const [selectedEventoId, setSelectedEventoId] = useState<string | undefined>(undefined);

  const handleOpenForm = (escala?: Escala, eventoId?: string) => {
    setSelectedEscala(escala);
    setSelectedEventoId(eventoId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedEscala(undefined);
    setSelectedEventoId(undefined);
    setIsFormOpen(false);
  };

  return (
    <>
      <EscalasList onEdit={handleOpenForm} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <EscalaForm 
            escala={selectedEscala} 
            eventoId={selectedEventoId}
            onClose={handleCloseForm} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 