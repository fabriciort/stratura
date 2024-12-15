import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { PessoaForm } from '../../components/pessoas/PessoaForm';
import { PessoasList } from '../../components/pessoas/PessoasList';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

interface PessoasPageProps {
  isNew?: boolean;
}

export function PessoasPage({ isNew }: PessoasPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pessoas } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<any>(null);

  useEffect(() => {
    if (isNew) {
      setShowForm(true);
      setSelectedPessoa(null);
    } else if (id) {
      const pessoa = pessoas.find(p => p.id === id);
      if (pessoa) {
        setShowForm(true);
        setSelectedPessoa(pessoa);
      } else {
        navigate('/pessoas');
      }
    }
  }, [isNew, id, pessoas, navigate]);

  const handleEdit = (pessoa: any) => {
    navigate(`/pessoas/${pessoa.id}`);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedPessoa(null);
    navigate('/pessoas');
  };

  if (showForm) {
    return <PessoaForm pessoa={selectedPessoa} onClose={handleClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pessoas</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro de pessoas disponíveis para eventos
          </p>
        </div>
        <Button onClick={() => navigate('/pessoas/novo')} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Pessoa
        </Button>
      </div>

      <PessoasList onEdit={handleEdit} />
    </div>
  );
} 