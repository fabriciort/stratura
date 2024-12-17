import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { User, Mail, Phone, Briefcase, Calendar, Edit2, Trash2, Search } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { Pessoa } from '../../types';

interface PessoasListProps {
  onEdit: (pessoa: Pessoa) => void;
}

export function PessoasList({ onEdit }: PessoasListProps) {
  const { pessoas, deletePessoa } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [funcaoFiltro, setFuncaoFiltro] = useState<string>('Todas');

  const handleDelete = async (pessoa: Pessoa) => {
    if (window.confirm(`Tem certeza que deseja excluir "${pessoa.nome}"?`)) {
      try {
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
      }
    }
  };

  const getFuncoes = () => {
    const funcoes = new Set<string>();
    pessoas.forEach(pessoa => {
      funcoes.add(pessoa.funcaoPrincipal);
      if (pessoa.funcaoSecundaria) {
        funcoes.add(pessoa.funcaoSecundaria);
      }
    });
    return Array.from(funcoes);
  };

  const filteredPessoas = pessoas.filter(pessoa => {
    const matchesSearch = pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pessoa.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuncao = funcaoFiltro === 'Todas' || 
      pessoa.funcaoPrincipal === funcaoFiltro || 
      pessoa.funcaoSecundaria === funcaoFiltro;
    return matchesSearch && matchesFuncao;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <select
          className="flex h-9 w-full sm:w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={funcaoFiltro}
          onChange={(e) => setFuncaoFiltro(e.target.value)}
        >
          <option value="Todas">Todas as funções</option>
          {getFuncoes().map(funcao => (
            <option key={funcao} value={funcao}>{funcao}</option>
          ))}
        </select>
      </div>

      {filteredPessoas.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <User className="h-8 w-8 text-muted-foreground" />
            <h3 className="font-semibold">Nenhuma pessoa encontrada</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || funcaoFiltro !== 'Todas'
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
                    <User className="h-5 w-5 text-primary" />
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
                    {pessoa.funcaoSecundaria && (
                      <span className="text-muted-foreground ml-1">
                        ({pessoa.funcaoSecundaria})
                      </span>
                    )}
                  </div>
                  
                  <div className="border-t pt-2 mt-2 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Disponibilidade:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Dias:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pessoa.disponibilidade.dias.map(dia => (
                            <span
                              key={dia}
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs",
                                "bg-primary/10 text-primary"
                              )}
                            >
                              {dia}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Períodos:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pessoa.disponibilidade.periodos.map(periodo => (
                            <span
                              key={periodo}
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs",
                                "bg-primary/10 text-primary"
                              )}
                            >
                              {periodo}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
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