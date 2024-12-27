import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Pessoa } from '../../types';
import { User, Phone, Mail, Calendar, Clock, ClipboardList } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';

interface PessoaFormProps {
  pessoa?: Pessoa;
  onClose: () => void;
}

const DIAS_SEMANA = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

const PERIODOS = ['Manhã', 'Tarde', 'Noite'];

const FUNCOES = ['Garçom', 'Bartender', 'Coordenador', 'Auxiliar'];

export function PessoaForm({ pessoa, onClose }: PessoaFormProps) {
  const { addPessoa, updatePessoa } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Pessoa, 'id' | 'createdAt' | 'updatedAt'>>({
    nome: '',
    email: '',
    telefone: '',
    funcaoPrincipal: '',
    funcaoSecundaria: '',
    disponibilidade: {
      dias: [],
      periodos: []
    },
    observacoes: ''
  });

  useEffect(() => {
    if (pessoa) {
      setFormData({
        nome: pessoa.nome,
        email: pessoa.email,
        telefone: pessoa.telefone,
        funcaoPrincipal: pessoa.funcaoPrincipal,
        funcaoSecundaria: pessoa.funcaoSecundaria || '',
        disponibilidade: {
          dias: [...pessoa.disponibilidade.dias],
          periodos: [...pessoa.disponibilidade.periodos]
        },
        observacoes: pessoa.observacoes || ''
      });
    }
  }, [pessoa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.telefone || !formData.funcaoPrincipal) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (pessoa) {
        await updatePessoa(pessoa.id, {
          ...formData,
          updatedAt: new Date()
        });
        toast({
          title: "Sucesso",
          description: "Pessoa atualizada com sucesso",
          variant: "success",
        });
      } else {
        await addPessoa({
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast({
          title: "Sucesso",
          description: "Pessoa adicionada com sucesso",
          variant: "success",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar",
        variant: "destructive",
      });
    }
  };

  const toggleDia = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      disponibilidade: {
        ...prev.disponibilidade,
        dias: prev.disponibilidade.dias.includes(dia)
          ? prev.disponibilidade.dias.filter(d => d !== dia)
          : [...prev.disponibilidade.dias, dia]
      }
    }));
  };

  const togglePeriodo = (periodo: string) => {
    setFormData(prev => ({
      ...prev,
      disponibilidade: {
        ...prev.disponibilidade,
        periodos: prev.disponibilidade.periodos.includes(periodo)
          ? prev.disponibilidade.periodos.filter(p => p !== periodo)
          : [...prev.disponibilidade.periodos, periodo]
      }
    }));
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            {pessoa ? 'Editar Pessoa' : 'Nova Pessoa'}
          </h2>
        </div>
      </div>

      <ScrollArea className="flex-1 px-1">
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={formData.telefone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funções */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Funções</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Função Principal</Label>
                    <Select 
                      value={formData.funcaoPrincipal}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, funcaoPrincipal: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função principal" />
                      </SelectTrigger>
                      <SelectContent>
                        {FUNCOES.map((funcao) => (
                          <SelectItem key={funcao} value={funcao.toLowerCase()}>
                            {funcao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Função Secundária (opcional)</Label>
                    <Select 
                      value={formData.funcaoSecundaria}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, funcaoSecundaria: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função secundária" />
                      </SelectTrigger>
                      <SelectContent>
                        {FUNCOES.map((funcao) => (
                          <SelectItem key={funcao} value={funcao.toLowerCase()}>
                            {funcao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disponibilidade */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Disponibilidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label>Dias Disponíveis</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {DIAS_SEMANA.map((dia) => (
                      <Button
                        key={dia}
                        type="button"
                        variant={formData.disponibilidade.dias.includes(dia) ? "default" : "outline"}
                        onClick={() => toggleDia(dia)}
                        className="justify-start"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {dia}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Períodos Disponíveis</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {PERIODOS.map((periodo) => (
                      <Button
                        key={periodo}
                        type="button"
                        variant={formData.disponibilidade.periodos.includes(periodo) ? "default" : "outline"}
                        onClick={() => togglePeriodo(periodo)}
                        className="justify-start"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {periodo}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Adicione observações sobre a pessoa..."
                  className={cn(
                    "flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </ScrollArea>

      <div className="flex justify-end space-x-4 pt-4 border-t mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {pessoa ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </div>
  );
} 