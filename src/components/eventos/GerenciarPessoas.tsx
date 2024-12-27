import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Evento, Pessoa, PessoaEscalada } from '../../types';
import { Users, Plus, X, Check } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface GerenciarPessoasProps {
  evento: Evento;
  isOpen: boolean;
  onClose: () => void;
}

export function GerenciarPessoas({ evento, isOpen, onClose }: GerenciarPessoasProps) {
  const { pessoas, updateEvento } = useApp();
  const { toast } = useToast();
  const [selectedPessoa, setSelectedPessoa] = useState<string>('');
  const [selectedFuncao, setSelectedFuncao] = useState<string>('');

  const handleAddPessoa = async () => {
    if (!selectedPessoa || !selectedFuncao) {
      toast({
        title: "Erro",
        description: "Selecione uma pessoa e uma função",
        variant: "destructive",
      });
      return;
    }

    const pessoa = pessoas.find(p => p.id.toString() === selectedPessoa);
    if (!pessoa) return;

    const novaPessoaEscalada: PessoaEscalada = {
      id: pessoa.id,
      nome: pessoa.nome,
      funcao: selectedFuncao,
      confirmado: false
    };

    try {
      const pessoasEscaladas = [...(evento.pessoasEscaladas || []), novaPessoaEscalada];
      await updateEvento(evento.id, {
        pessoasEscaladas,
        updatedAt: new Date()
      });

      setSelectedPessoa('');
      setSelectedFuncao('');

      toast({
        title: "Sucesso",
        description: "Pessoa adicionada à escala",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a pessoa",
        variant: "destructive",
      });
    }
  };

  const handleRemoverPessoa = async (pessoaId: number) => {
    try {
      const pessoasEscaladas = evento.pessoasEscaladas?.filter(p => p.id !== pessoaId) || [];
      await updateEvento(evento.id, {
        pessoasEscaladas,
        updatedAt: new Date()
      });

      toast({
        title: "Sucesso",
        description: "Pessoa removida da escala",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a pessoa",
        variant: "destructive",
      });
    }
  };

  const handleConfirmarPessoa = async (pessoaId: number) => {
    try {
      const pessoasEscaladas = evento.pessoasEscaladas?.map(p => 
        p.id === pessoaId ? { ...p, confirmado: !p.confirmado } : p
      ) || [];
      
      await updateEvento(evento.id, {
        pessoasEscaladas,
        updatedAt: new Date()
      });

      toast({
        title: "Sucesso",
        description: "Status de confirmação atualizado",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Pessoas - {evento.nome}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Pessoa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pessoa</Label>
                  <Select value={selectedPessoa} onValueChange={setSelectedPessoa}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {pessoas.map((pessoa) => (
                        <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                          {pessoa.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Função</Label>
                  <Select value={selectedFuncao} onValueChange={setSelectedFuncao}>
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
                  <Button onClick={handleAddPessoa} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pessoas Escaladas</CardTitle>
            </CardHeader>
            <CardContent>
              {evento.pessoasEscaladas && evento.pessoasEscaladas.length > 0 ? (
                <div className="space-y-4">
                  {evento.pessoasEscaladas.map((pessoa) => (
                    <Card key={pessoa.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{pessoa.nome}</p>
                          <p className="text-sm text-muted-foreground">{pessoa.funcao}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={pessoa.confirmado ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleConfirmarPessoa(pessoa.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoverPessoa(pessoa.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma pessoa escalada ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 