import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Evento } from '../../types';
import { Calendar, Clock, MapPin, Users, Utensils } from 'lucide-react';

interface EventoFormProps {
  evento?: Evento;
  onClose: () => void;
}

export function EventoForm({ evento, onClose }: EventoFormProps) {
  const { addEvento, updateEvento, cardapios } = useApp();
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    horarioInicio: '',
    horarioFim: '',
    local: '',
    tipo: '',
    cardapioId: '',
    quantidadePessoas: 0,
    observacoes: ''
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        ...evento,
        data: new Date(evento.data).toISOString().split('T')[0],
        observacoes: evento.observacoes || ''
      });
    }
  }, [evento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventoData = {
      ...formData,
      data: new Date(formData.data),
      quantidadePessoas: Number(formData.quantidadePessoas)
    };
    
    if (evento) {
      updateEvento(evento.id, eventoData);
    } else {
      addEvento(eventoData);
    }
    
    onClose();
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>{evento ? 'Editar' : 'Novo'} Evento</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Evento</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo do Evento</Label>
              <Input
                id="tipo"
                value={formData.tipo}
                onChange={(e) => handleChange('tipo', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleChange('data', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="horarioInicio">Horário de Início</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="horarioInicio"
                  type="time"
                  value={formData.horarioInicio}
                  onChange={(e) => handleChange('horarioInicio', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="horarioFim">Horário de Término</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="horarioFim"
                  type="time"
                  value={formData.horarioFim}
                  onChange={(e) => handleChange('horarioFim', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="local"
                  value={formData.local}
                  onChange={(e) => handleChange('local', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidadePessoas">Quantidade de Pessoas</Label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="quantidadePessoas"
                  type="number"
                  min="1"
                  value={formData.quantidadePessoas}
                  onChange={(e) => handleChange('quantidadePessoas', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardapioId">Cardápio</Label>
            <div className="relative">
              <Utensils className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                id="cardapioId"
                className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.cardapioId}
                onChange={(e) => handleChange('cardapioId', e.target.value)}
                required
              >
                <option value="">Selecione um cardápio</option>
                {cardapios.map((cardapio) => (
                  <option key={cardapio.id} value={cardapio.id}>
                    {cardapio.nome}
                  </option>
                ))}
              </select>
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
            {evento ? 'Salvar' : 'Criar'} Evento
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 