import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Escala, Evento, Pessoa } from '../../types';
import { ClipboardList, Plus, Trash2, Calendar, Clock, MapPin, Users } from 'lucide-react';

interface EscalaFormProps {
  escala?: Escala;
  eventoId?: string;
  onClose: () => void;
}

interface PessoaEscala {
  pessoaId: string;
  funcao: string;
}

export function EscalaForm({ escala, eventoId, onClose }: EscalaFormProps) {
  const { addEscala, updateEscala, eventos, pessoas } = useApp();
  const [formData, setFormData] = useState({
    eventoId: eventoId || '',
    pessoas: [] as PessoaEscala[],
    status: 'rascunho' as Escala['status'],
    observacoes: ''
  });

  const [novaPessoa, setNovaPessoa] = useState<PessoaEscala>({
    pessoaId: '',
    funcao: ''
  });

  useEffect(() => {
    if (escala) {
      setFormData({
        ...escala,
        observacoes: escala.observacoes || ''
      });
    } else if (eventoId) {
      setFormData(prev => ({
        ...prev,
        eventoId
      }));
    }
  }, [escala, eventoId]);

  const eventoSelecionado = eventos.find(e => e.id === formData.eventoId);
  const pessoasDisponiveis = pessoas.filter(p => 
    !formData.pessoas.some(pe => pe.pessoaId === p.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.pessoas.length === 0) {
      alert('Adicione pelo menos uma pessoa à escala');
      return;
    }
    
    if (escala) {
      updateEscala(escala.id, formData);
    } else {
      addEscala(formData);
    }
    
    onClose();
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNovaPessoaChange = (field: keyof PessoaEscala, value: string) => {
    setNovaPessoa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adicionarPessoa = () => {
    if (!novaPessoa.pessoaId || !novaPessoa.funcao) {
      alert('Selecione a pessoa e sua função');
      return;
    }

    setFormData(prev => ({
      ...prev,
      pessoas: [...prev.pessoas, novaPessoa]
    }));

    setNovaPessoa({
      pessoaId: '',
      funcao: ''
    });
  };

  const removerPessoa = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pessoas: prev.pessoas.filter((_, i) => i !== index)
    }));
  };

  const getPessoaNome = (pessoaId: string): string => {
    const pessoa = pessoas.find(p => p.id === pessoaId);
    return pessoa ? pessoa.nome : 'Pessoa não encontrada';
  };

  if (!eventoSelecionado) {
    return (
      <div className="text-center p-4">
        <p>Evento não encontrado</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ClipboardList className="h-5 w-5" />
          <span>{escala ? 'Editar' : 'Nova'} Escala</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 p-4 border rounded-lg bg-secondary/10">
            <div className="grid gap-2 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {new Date(eventoSelecionado.data).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {eventoSelecionado.horarioInicio} às {eventoSelecionado.horarioFim}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {eventoSelecionado.local}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                {eventoSelecionado.quantidadePessoas} pessoas esperadas
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Equipe</Label>
            
            <div className="grid gap-4 p-4 border rounded-lg">
              <div className="grid gap-4 md:grid-cols-[2fr,1fr,auto]">
                <div className="space-y-2">
                  <Label htmlFor="pessoaId">Pessoa</Label>
                  <select
                    id="pessoaId"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={novaPessoa.pessoaId}
                    onChange={(e) => handleNovaPessoaChange('pessoaId', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {pessoasDisponiveis.map((pessoa) => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome} - {pessoa.funcaoPrincipal}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funcao">Função</Label>
                  <Input
                    id="funcao"
                    value={novaPessoa.funcao}
                    onChange={(e) => handleNovaPessoaChange('funcao', e.target.value)}
                    placeholder="Ex: Garçom"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={adicionarPessoa}
                    size="sm"
                    className="mb-0.5"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {formData.pessoas.map((pessoa, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium">
                        {getPessoaNome(pessoa.pessoaId)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pessoa.funcao}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerPessoa(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="rascunho">Rascunho</option>
              <option value="confirmada">Confirmada</option>
              <option value="finalizada">Finalizada</option>
            </select>
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
            {escala ? 'Salvar' : 'Criar'} Escala
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 