import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Pessoa } from '../../types';
import { Users, Mail, Phone, Briefcase, Calendar, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { LoadingList } from '../ui/loading-list';
import { useToast } from '../../hooks/useToast';

interface PessoasListProps {
  onEdit: (pessoa: Pessoa) => void;
}

const FUNCOES = ['Garçom', 'Copeiro', 'Cozinheiro', 'Auxiliar'] as const;

export function PessoasList({ onEdit }: PessoasListProps) {
  const { pessoas, deletePessoa } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [funcaoFiltro, setFuncaoFiltro] = useState<string>('');

  const handleDelete = async (pessoa: Pessoa) => {
    if (window.confirm(`Tem certeza que deseja excluir ${pessoa.nome}?`)) {
      try {
        setLoading(true);
        deletePessoa(pessoa.id);
        toast({
          title: "Pessoa excluída",
          description: `${pessoa.nome} foi removido(a) com sucesso.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir a pessoa. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredPessoas = pessoas.filter((pessoa) => {
    const matchesSearch = pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pessoa.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuncao = !funcaoFiltro || pessoa.funcaoPrincipal === funcaoFiltro;
    return matchesSearch && matchesFuncao;
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
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="funcao">Filtrar por Função</Label>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select
              id="funcao"
              value={funcaoFiltro}
              onChange={(e) => setFuncaoFiltro(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Todas as funções</option>
              {FUNCOES.map((funcao) => (
                <option key={funcao} value={funcao}>{funcao}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredPessoas.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Users className="h-8 w-8 text-muted-foreground" />
            <h3 className="font-semibold">Nenhuma pessoa encontrada</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || funcaoFiltro
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando uma nova pessoa"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPessoas.map((pessoa) => (
            <Card key={pessoa.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{pessoa.nome}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(pessoa)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(pessoa)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {pessoa.email}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {pessoa.telefone}
                  </div>
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    {pessoa.funcaoPrincipal}
                    {pessoa.funcoesSecundarias.length > 0 && (
                      <span className="text-muted-foreground ml-1">
                        (+{pessoa.funcoesSecundarias.length})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {pessoa.disponibilidade.dias.length} dias disponíveis
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 