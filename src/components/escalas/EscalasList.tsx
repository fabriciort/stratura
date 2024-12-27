import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Escala } from '../../types';
import { ClipboardList, Search, Filter, Calendar, Clock, Users, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { LoadingList } from '../ui/loading-list';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';

interface EscalasListProps {
  onEdit: (escala: Escala) => void;
}

const STATUS = ['Todos', 'Rascunho', 'Confirmada', 'Finalizada'] as const;

export function EscalasList({ onEdit }: EscalasListProps) {
  const { escalas, eventos, pessoas, deleteEscala } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');

  const handleDelete = async (escala: Escala) => {
    const evento = eventos.find(e => e.id === escala.eventoId);
    if (!evento) return;

    if (window.confirm(`Tem certeza que deseja excluir a escala do evento "${evento.nome}"?`)) {
      try {
        setLoading(true);
        await deleteEscala(escala.id);
        toast({
          title: "Escala excluída",
          description: `A escala do evento "${evento.nome}" foi removida com sucesso.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir a escala. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getEvento = (eventoId: number) => {
    return eventos.find(e => e.id === eventoId);
  };

  const getPessoaNome = (pessoaId: number) => {
    const pessoa = pessoas.find(p => p.id === pessoaId);
    return pessoa ? pessoa.nome : 'Pessoa não encontrada';
  };

  const getStatusColor = (status: Escala['status']) => {
    const colors = {
      rascunho: 'text-yellow-500',
      confirmada: 'text-green-500',
      finalizada: 'text-blue-500'
    };
    return colors[status] || 'text-muted-foreground';
  };

  const filteredEscalas = escalas
    .filter(escala => {
      const evento = getEvento(escala.eventoId);
      if (!evento) return false;

      const matchesSearch = evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escala.pessoas.some(p => getPessoaNome(p.pessoaId).toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFiltro === 'Todos' || escala.status.toLowerCase() === statusFiltro.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const eventoA = getEvento(a.eventoId);
      const eventoB = getEvento(b.eventoId);
      if (!eventoA || !eventoB) return 0;
      return new Date(eventoB.data).getTime() - new Date(eventoA.data).getTime();
    });

  if (loading) {
    return <LoadingList count={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por evento ou pessoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEscalas.length > 0 ? (
          filteredEscalas.map((escala) => {
            const evento = getEvento(escala.eventoId);
            if (!evento) return null;

            return (
              <Card key={escala.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>{evento.nome}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className={cn("text-sm font-medium", getStatusColor(escala.status))}>
                        {escala.status.charAt(0).toUpperCase() + escala.status.slice(1)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(escala)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(escala)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(evento.data).toLocaleDateString('pt-BR')} - {evento.horarioInicio} às {evento.horarioFim}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      {escala.pessoas.length} pessoas escaladas
                    </div>
                    {escala.pessoas.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {escala.pessoas.map((pessoa, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{getPessoaNome(pessoa.pessoaId)}</span>
                            <span className="text-muted-foreground">{pessoa.funcao}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma escala encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
} 