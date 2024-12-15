import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Pessoa } from '../../types';

interface PessoaFormProps {
  pessoa?: Pessoa;
  onClose: () => void;
}

const DIAS_SEMANA = [
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
  'sabado',
  'domingo'
] as const;

const PERIODOS = ['manha', 'tarde', 'noite'] as const;

const FUNCOES = ['Garçom', 'Copeiro', 'Cozinheiro', 'Auxiliar'] as const;

type FormData = {
  nome: string;
  email: string;
  telefone: string;
  funcaoPrincipal: string;
  funcoesSecundarias: string[];
  disponibilidade: {
    dias: typeof DIAS_SEMANA[number][];
    periodos: typeof PERIODOS[number][];
  };
  observacoes: string;
};

export function PessoaForm({ pessoa, onClose }: PessoaFormProps) {
  const { addPessoa, updatePessoa } = useApp();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    funcaoPrincipal: '',
    funcoesSecundarias: [],
    disponibilidade: {
      dias: [],
      periodos: []
    },
    observacoes: ''
  });

  useEffect(() => {
    if (pessoa) {
      setFormData({
        ...pessoa,
        observacoes: pessoa.observacoes || ''
      });
    }
  }, [pessoa]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pessoa) {
      updatePessoa(pessoa.id, formData);
    } else {
      addPessoa(formData);
    }
    
    onClose();
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDia = (dia: typeof DIAS_SEMANA[number]) => {
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

  const togglePeriodo = (periodo: typeof PERIODOS[number]) => {
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

  const toggleFuncaoSecundaria = (funcao: string) => {
    setFormData(prev => ({
      ...prev,
      funcoesSecundarias: prev.funcoesSecundarias.includes(funcao)
        ? prev.funcoesSecundarias.filter(f => f !== funcao)
        : [...prev.funcoesSecundarias, funcao]
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{pessoa ? 'Editar' : 'Nova'} Pessoa</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funcaoPrincipal">Função Principal</Label>
              <select
                id="funcaoPrincipal"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.funcaoPrincipal}
                onChange={(e) => handleChange('funcaoPrincipal', e.target.value)}
                required
              >
                <option value="">Selecione uma função</option>
                {FUNCOES.map((funcao) => (
                  <option key={funcao} value={funcao}>
                    {funcao}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Funções Secundárias</Label>
            <div className="flex flex-wrap gap-2">
              {FUNCOES.filter(f => f !== formData.funcaoPrincipal).map((funcao) => (
                <Button
                  key={funcao}
                  type="button"
                  variant={formData.funcoesSecundarias.includes(funcao) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFuncaoSecundaria(funcao)}
                >
                  {funcao}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Disponibilidade - Dias</Label>
            <div className="flex flex-wrap gap-2">
              {DIAS_SEMANA.map((dia) => (
                <Button
                  key={dia}
                  type="button"
                  variant={formData.disponibilidade.dias.includes(dia) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleDia(dia)}
                >
                  {dia.charAt(0).toUpperCase() + dia.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Disponibilidade - Períodos</Label>
            <div className="flex flex-wrap gap-2">
              {PERIODOS.map((periodo) => (
                <Button
                  key={periodo}
                  type="button"
                  variant={formData.disponibilidade.periodos.includes(periodo) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => togglePeriodo(periodo)}
                >
                  {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <textarea
              id="observacoes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {pessoa ? 'Salvar' : 'Criar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 