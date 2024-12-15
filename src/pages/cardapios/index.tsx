import { useState } from 'react';
import { CardapiosList } from '../../components/cardapios/CardapiosList';
import { CardapioForm } from '../../components/cardapios/CardapioForm';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Cardapio } from '../../types';

export function CardapiosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCardapio, setSelectedCardapio] = useState<Cardapio | undefined>(undefined);

  const handleOpenForm = (cardapio?: Cardapio) => {
    setSelectedCardapio(cardapio);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedCardapio(undefined);
    setIsFormOpen(false);
  };

  return (
    <>
      <CardapiosList onEdit={handleOpenForm} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <CardapioForm cardapio={selectedCardapio} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </>
  );
} 