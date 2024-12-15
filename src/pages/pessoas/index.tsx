import { useState } from 'react';
import { PessoasList } from '../../components/pessoas/PessoasList';
import { PessoaForm } from '../../components/pessoas/PessoaForm';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Pessoa } from '../../types';

export function PessoasPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | undefined>(undefined);

  const handleOpenForm = (pessoa?: Pessoa) => {
    setSelectedPessoa(pessoa);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedPessoa(undefined);
    setIsFormOpen(false);
  };

  return (
    <>
      <PessoasList onEdit={handleOpenForm} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <PessoaForm pessoa={selectedPessoa} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </>
  );
} 