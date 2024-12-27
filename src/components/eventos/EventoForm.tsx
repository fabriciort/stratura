import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Evento } from '../../types';
import { Calendar, Beer, Camera } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { DialogHeader, DialogTitle } from '../ui/dialog';

interface EventoFormProps {
  evento?: Evento;
  onClose: () => void;
}

const TIPOS_EVENTO = [
  'Casamento',
  'Aniversário',
  'Corporativo',
  'Formatura',
  'Confraternização',
  'Outro'
] as const;

const TIPOS_BEBIDA = [
  'cerveja',
  'chopp',
  'drinks',
  'refrigerante',
  'agua'
] as const;

type TipoBebida = typeof TIPOS_BEBIDA[number];

export function EventoForm({ evento, onClose }: EventoFormProps) {
  const { addEvento, updateEvento } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>>({
    nome: '',
    data: '',
    horarioInicio: '',
    horarioFim: '',
    local: '',
    tipo: '',
    quantidadePessoas: 0,
    caracteristicas: {
      cardapio: {
        nome: '',
        itens: []
      },
      temBebidas: false,
      tipoBebidas: [] as TipoBebida[],
      temCabineFoto: false,
      tipoCabineFoto: undefined,
      outrasCaracteristicas: []
    },
    observacoes: '',
    status: 'pendente',
    progresso: {
      escalaCompleta: false,
      equipePronta: false,
      materiaisPreparados: false,
      checklistConcluido: false,
      emAndamento: false,
      finalizado: false
    }
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        nome: evento.nome,
        data: evento.data,
        horarioInicio: evento.horarioInicio,
        horarioFim: evento.horarioFim,
        local: evento.local,
        tipo: evento.tipo,
        quantidadePessoas: evento.quantidadePessoas,
        caracteristicas: {
          ...evento.caracteristicas,
          cardapio: evento.caracteristicas.cardapio || { nome: '', itens: [] },
          tipoBebidas: evento.caracteristicas.tipoBebidas || [],
          outrasCaracteristicas: evento.caracteristicas.outrasCaracteristicas || []
        },
        observacoes: evento.observacoes || '',
        status: evento.status,
        progresso: evento.progresso
      });
    }
  }, [evento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.data || !formData.horarioInicio || !formData.horarioFim || !formData.local || !formData.tipo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (evento) {
        await updateEvento(evento.id, {
          ...formData,
          updatedAt: new Date()
        });
        toast({
          title: "Sucesso",
          description: "Evento atualizado com sucesso",
          variant: "success",
        });
      } else {
        await addEvento({
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast({
          title: "Sucesso",
          description: "Evento criado com sucesso",
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

  const toggleTipoBebida = (tipo: TipoBebida) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: {
        ...prev.caracteristicas,
        tipoBebidas: prev.caracteristicas.tipoBebidas.includes(tipo)
          ? prev.caracteristicas.tipoBebidas.filter(t => t !== tipo)
          : [...prev.caracteristicas.tipoBebidas, tipo]
      }
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{evento ? 'Editar Evento' : 'Novo Evento'}</span>
          </div>
        </DialogTitle>
      </DialogHeader>

      <ScrollArea className="flex-1 px-1 -mx-6">
        <form onSubmit={handleSubmit} className="space-y-6 py-4 px-6">
          <div className="grid gap-6">
            {/* Informações Básicas */}
            <Card>
      <CardHeader>
                <CardTitle className="text-base">Informações Básicas</CardTitle>
      </CardHeader>
        <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                    <Label>Nome do Evento</Label>
              <Input
                value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Nome do evento"
              />
            </div>
            <div className="space-y-2">
                    <Label>Tipo do Evento</Label>
                    <Select 
                value={formData.tipo}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_EVENTO.map((tipo) => (
                          <SelectItem key={tipo} value={tipo.toLowerCase()}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
          </div>
            <div className="space-y-2">
                    <Label>Data</Label>
                <Input
                  type="date"
                  value={formData.data}
                      onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>
                  <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                      <Label>Início</Label>
                <Input
                  type="time"
                  value={formData.horarioInicio}
                        onChange={(e) => setFormData(prev => ({ ...prev, horarioInicio: e.target.value }))}
                />
            </div>
            <div className="space-y-2">
                      <Label>Término</Label>
                <Input
                  type="time"
                  value={formData.horarioFim}
                        onChange={(e) => setFormData(prev => ({ ...prev, horarioFim: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
                    <Label>Local</Label>
                <Input
                  value={formData.local}
                      onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
                      placeholder="Endereço do evento"
                />
            </div>
            <div className="space-y-2">
                    <Label>Quantidade de Pessoas</Label>
                <Input
                  type="number"
                  value={formData.quantidadePessoas}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantidadePessoas: parseInt(e.target.value) || 0 }))}
                      min={0}
                />
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Características */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Características do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
            <div className="space-y-4">
                  <Label>Bebidas</Label>
                <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={formData.caracteristicas.temBebidas ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        caracteristicas: {
                          ...prev.caracteristicas,
                          temBebidas: !prev.caracteristicas.temBebidas
                        }
                      }))}
                    >
                      <Beer className="h-4 w-4 mr-2" />
                      {formData.caracteristicas.temBebidas ? "Tem Bebidas" : "Sem Bebidas"}
                    </Button>
                </div>

                {formData.caracteristicas.temBebidas && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {TIPOS_BEBIDA.map((tipo) => (
                        <Button
                          key={tipo}
                          type="button"
                          variant={formData.caracteristicas.tipoBebidas.includes(tipo) ? "default" : "outline"}
                          onClick={() => toggleTipoBebida(tipo)}
                          className="justify-start"
                        >
                          <Beer className="h-4 w-4 mr-2" />
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </Button>
                      ))}
                  </div>
                )}
                </div>

                <div className="space-y-4">
                  <Label>Cabine de Foto</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={formData.caracteristicas.temCabineFoto ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        caracteristicas: {
                          ...prev.caracteristicas,
                          temCabineFoto: !prev.caracteristicas.temCabineFoto
                        }
                      }))}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {formData.caracteristicas.temCabineFoto ? "Tem Cabine" : "Sem Cabine"}
                    </Button>
                  </div>

                  {formData.caracteristicas.temCabineFoto && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        type="button"
                        variant={formData.caracteristicas.tipoCabineFoto === 'propria' ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          caracteristicas: {
                            ...prev.caracteristicas,
                            tipoCabineFoto: 'propria'
                          }
                        }))}
                      >
                        Própria
                      </Button>
                      <Button
                        type="button"
                        variant={formData.caracteristicas.tipoCabineFoto === 'externa' ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          caracteristicas: {
                            ...prev.caracteristicas,
                            tipoCabineFoto: 'externa'
                          }
                        }))}
                      >
                        Externa
                      </Button>
                  </div>
                )}
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
                  placeholder="Adicione observações sobre o evento..."
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
          {evento ? 'Atualizar' : 'Criar'}
          </Button>
      </div>
    </div>
  );
} 