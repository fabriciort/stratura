import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Evento, ItemCardapio } from '../../types';
import { Calendar, Clock, MapPin, Users, Beer, Camera } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface EventoFormProps {
  evento?: Evento;
  onClose: () => void;
}

export function EventoForm({ evento, onClose }: EventoFormProps) {
  const { addEvento, updateEvento } = useApp();
  const [formData, setFormData] = useState({
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
        itens: [] as ItemCardapio[]
      },
      temBebidas: false,
      tipoBebidas: [] as ('cerveja' | 'chopp' | 'drinks' | 'refrigerante' | 'agua')[],
      temCabineFoto: false,
      tipoCabineFoto: undefined as 'propria' | 'externa' | undefined,
      outrasCaracteristicas: [] as string[]
    },
    observacoes: ''
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        ...evento,
        data: new Date(evento.data).toISOString().split('T')[0],
        caracteristicas: {
          ...evento.caracteristicas,
          cardapio: evento.caracteristicas.cardapio || { nome: '', itens: [] },
          tipoBebidas: evento.caracteristicas.tipoBebidas || [],
          outrasCaracteristicas: evento.caracteristicas.outrasCaracteristicas || []
        },
        observacoes: evento.observacoes || ''
      });
    }
  }, [evento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventoData = {
        ...formData,
        data: formData.data,
        quantidadePessoas: Number(formData.quantidadePessoas),
        status: evento?.status || 'pendente' as const,
        progresso: evento?.progresso || {
          escalaCompleta: false,
          equipePronta: false,
          materiaisPreparados: false,
          checklistConcluido: false,
          emAndamento: false,
          finalizado: false
        },
        caracteristicas: {
          ...formData.caracteristicas,
          cardapio: {
            ...formData.caracteristicas.cardapio,
            itens: formData.caracteristicas.cardapio.itens || []
          }
        }
      };
      
      if (evento) {
        await updateEvento(evento.id, {
          ...eventoData,
          updatedAt: new Date()
        });
      } else {
        await addEvento({
          ...eventoData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    const fields = field.split('.');
    if (fields.length === 1) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        caracteristicas: {
          ...prev.caracteristicas,
          [fields[1]]: value
        }
      }));
    }
  };

  const handleCardapioChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: {
        ...prev.caracteristicas,
        cardapio: {
          ...prev.caracteristicas.cardapio,
          [field]: value
        }
      }
    }));
  };

  const handleTipoBebidaChange = (tipo: 'cerveja' | 'chopp' | 'drinks' | 'refrigerante' | 'agua') => {
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

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Características do Evento</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cardápio</Label>
                <Input
                  placeholder="Nome do Cardápio"
                  value={formData.caracteristicas.cardapio.nome}
                  onChange={(e) => handleCardapioChange('nome', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="temBebidas"
                    checked={formData.caracteristicas.temBebidas}
                    onCheckedChange={(checked) => handleChange('caracteristicas.temBebidas', checked)}
                  />
                  <Label htmlFor="temBebidas" className="flex items-center space-x-2">
                    <Beer className="h-4 w-4" />
                    <span>Serviço de Bebidas</span>
                  </Label>
                </div>

                {formData.caracteristicas.temBebidas && (
                  <div className="ml-6 mt-2 space-y-2">
                    <Label>Tipos de Bebidas</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['cerveja', 'chopp', 'drinks', 'refrigerante', 'agua'].map((tipo) => (
                        <div key={tipo} className="flex items-center space-x-2">
                          <Checkbox
                            id={`bebida-${tipo}`}
                            checked={formData.caracteristicas.tipoBebidas.includes(tipo as any)}
                            onCheckedChange={() => handleTipoBebidaChange(tipo as any)}
                          />
                          <Label htmlFor={`bebida-${tipo}`}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="temCabineFoto"
                    checked={formData.caracteristicas.temCabineFoto}
                    onCheckedChange={(checked) => handleChange('caracteristicas.temCabineFoto', checked)}
                  />
                  <Label htmlFor="temCabineFoto" className="flex items-center space-x-2">
                    <Camera className="h-4 w-4" />
                    <span>Cabine de Foto</span>
                  </Label>
                </div>

                {formData.caracteristicas.temCabineFoto && (
                  <div className="ml-6 mt-2 space-y-2">
                    <Label>Tipo de Cabine</Label>
                    <RadioGroup
                      value={formData.caracteristicas.tipoCabineFoto}
                      onValueChange={(value) => handleChange('caracteristicas.tipoCabineFoto', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="propria" id="cabine-propria" />
                        <Label htmlFor="cabine-propria">Própria</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="externa" id="cabine-externa" />
                        <Label htmlFor="cabine-externa">Externa</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
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