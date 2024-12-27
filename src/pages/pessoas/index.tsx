import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { PessoaForm } from '../../components/pessoas/PessoaForm';
import { PessoasList } from '../../components/pessoas/PessoasList';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { Pessoa } from '../../types';
import { Dialog, DialogContent } from '../../components/ui/dialog';

export function PessoasPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pessoas } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | undefined>();

  useEffect(() => {
    if (id) {
      const pessoa = pessoas.find(p => p.id === Number(id));
      if (pessoa) {
        setSelectedPessoa(pessoa);
      } else {
        navigate('/pessoas');
      }
    }
  }, [id, pessoas, navigate]);

  const handleNovaPessoa = () => {
    setSelectedPessoa(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPessoa(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pessoas</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe e colaboradores
          </p>
        </div>
        <Button onClick={handleNovaPessoa} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Pessoa
        </Button>
      </div>

      <PessoasList onEdit={handleEdit} />

      {/* Modal do formulário de pessoa */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <PessoaForm 
            pessoa={selectedPessoa}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 