import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Escala, Evento, Pessoa } from '../../types';
import { ClipboardList, Plus, Trash2, Calendar, Clock, MapPin, Users, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface EscalaFormProps {
  escala?: Escala;
  eventoId?: string;
  onClose: () => void;
}

interface PessoaEscala {
  pessoaId: string;
  funcao: string;
  confirmado: boolean;
}

export function EscalaForm({ escala, eventoId, onClose }: EscalaFormProps) {
  const { addEscala, updateEscala, eventos, pessoas } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    eventoId: string;
    pessoas: PessoaEscala[];
    status: Escala['status'];
    observacoes: string;
  }>({
    eventoId: eventoId || '',
    pessoas: [],
    status: 'rascunho',
    observacoes: ''
  });

  const [novaPessoa, setNovaPessoa] = useState<PessoaEscala>({
    pessoaId: '',
    funcao: '',
    confirmado: false
  });

  useEffect(() => {
    if (escala) {
      setFormData({
        eventoId: escala.eventoId.toString(),
        pessoas: escala.pessoas.map(p => ({
          pessoaId: p.pessoaId.toString(),
          funcao: p.funcao,
          confirmado: p.confirmado
        })),
        status: escala.status,
        observacoes: escala.observacoes || ''
      });
    } else if (eventoId) {
      setFormData(prev => ({
        ...prev,
        eventoId: eventoId.toString()
      }));
    }
  }, [escala, eventoId]);

  const eventoSelecionado = eventos.find(e => e.id.toString() === formData.eventoId);
  const pessoasDisponiveis = pessoas.filter(p => 
    !formData.pessoas.some(pe => pe.pessoaId === p.id.toString())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.pessoas.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma pessoa à escala",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const escalaData = {
        eventoId: Number(formData.eventoId),
        pessoas: formData.pessoas.map(p => ({
          pessoaId: Number(p.pessoaId),
          funcao: p.funcao,
          confirmado: p.confirmado
        })),
        status: formData.status,
        observacoes: formData.observacoes
      };

      if (escala) {
        await updateEscala(escala.id, {
          ...escalaData,
          updatedAt: new Date()
        });
        toast({
          title: "Sucesso",
          description: "Escala atualizada com sucesso",
          variant: "success",
        });
      } else {
        await addEscala({
          ...escalaData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast({
          title: "Sucesso",
          description: "Escala criada com sucesso",
          variant: "success",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a escala",
        variant: "destructive",
      });
    }
  };

  const adicionarPessoa = () => {
    if (!novaPessoa.pessoaId || !novaPessoa.funcao) {
      toast({
        title: "Erro",
        description: "Selecione a pessoa e sua função",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      pessoas: [...prev.pessoas, novaPessoa]
    }));

    setNovaPessoa({
      pessoaId: '',
      funcao: '',
      confirmado: false
    });
  };

  const removerPessoa = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pessoas: prev.pessoas.filter((_, i) => i !== index)
    }));
  };

  const getPessoaNome = (pessoaId: string): string => {
    const pessoa = pessoas.find(p => p.id.toString() === pessoaId);
    return pessoa ? pessoa.nome : 'Pessoa não encontrada';
  };

  if (!eventoSelecionado) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Evento não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{eventoSelecionado.nome}</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{new Date(eventoSelecionado.data).toLocaleDateString('pt-BR')}</span>
          <span>•</span>
          <span>{eventoSelecionado.horarioInicio} às {eventoSelecionado.horarioFim}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-1">
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-6">
            {/* Seção de Adicionar Pessoas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Adicionar Pessoas à Escala</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Pessoa</Label>
                    <Select 
                      value={novaPessoa.pessoaId} 
                      onValueChange={(value) => setNovaPessoa(prev => ({ ...prev, pessoaId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma pessoa" />
                      </SelectTrigger>
                      <SelectContent>
                        {pessoasDisponiveis.map((pessoa) => (
                          <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                            {pessoa.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Função</Label>
                    <Select 
                      value={novaPessoa.funcao} 
                      onValueChange={(value) => setNovaPessoa(prev => ({ ...prev, funcao: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="garcom">Garçom</SelectItem>
                        <SelectItem value="bartender">Bartender</SelectItem>
                        <SelectItem value="coordenador">Coordenador</SelectItem>
                        <SelectItem value="auxiliar">Auxiliar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={adicionarPessoa} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seção de Pessoas Escaladas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Pessoas Escaladas</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formData.pessoas.length} pessoa(s)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.pessoas.length > 0 ? (
                    formData.pessoas.map((pessoa, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{getPessoaNome(pessoa.pessoaId)}</p>
                            <p className="text-sm text-muted-foreground">{pessoa.funcao}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant={pessoa.confirmado ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  pessoas: prev.pessoas.map((p, i) => 
                                    i === index ? { ...p, confirmado: !p.confirmado } : p
                                  )
                                }));
                              }}
                            >
                              <Check className={cn("h-4 w-4", pessoa.confirmado ? "text-white" : "text-muted-foreground")} />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removerPessoa(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {pessoa.confirmado ? "Confirmado" : "Aguardando confirmação"}
                        </p>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhuma pessoa escalada ainda
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seção de Observações e Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalhes da Escala</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status da Escala</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: Escala['status']) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="finalizada">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {formData.status === 'rascunho' && 'A escala ainda está em elaboração'}
                    {formData.status === 'confirmada' && 'A escala está confirmada e as pessoas foram notificadas'}
                    {formData.status === 'finalizada' && 'O evento foi realizado e a escala está finalizada'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Adicione observações sobre a escala..."
                    className={cn(
                      "flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  />
                </div>
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
          {escala ? 'Atualizar Escala' : 'Criar Escala'}
        </Button>
      </div>
    </div>
  );
} 