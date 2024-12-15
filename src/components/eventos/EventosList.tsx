import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Evento } from '../../types';
import { Calendar, Clock, MapPin, Users, Search, Filter, Edit2, Trash2, Beer, Camera } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { StatusIndicator } from '../ui/status-indicator';
import { cn } from '../../lib/utils';

interface EventosListProps {
  onEdit: (evento: Evento) => void;
}

const STATUS = ['Todos', 'Pendente', 'Em Andamento', 'Finalizado', 'Cancelado'] as const;

export function EventosList({ onEdit }: EventosListProps) {
  const { eventos, deleteEvento } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');

  const handleDelete = async (evento: Evento) => {
    if (window.confirm(`Tem certeza que deseja excluir "${evento.nome}"?`)) {
      try {
        deleteEvento(evento.id);
        toast({
          title: "Evento excluído",
          description: `${evento.nome} foi removido com sucesso.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o evento. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const getEventoStatus = (evento: Evento) => {
    switch (evento.status) {
      case 'finalizado':
        return 'Finalizado';
      case 'em_andamento':
        return 'Em Andamento';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };

  const filteredEventos = eventos.filter((evento) => {
    const matchesSearch = evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.local.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getEventoStatus(evento);
    const matchesStatus = statusFiltro === 'Todos' || status === statusFiltro;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <select
          className="flex h-9 w-full sm:w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
        >
          {STATUS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {filteredEventos.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Calendar className="h-8 w-8 text-muted-foreground" />
            <h3 className="font-semibold">Nenhum evento encontrado</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFiltro !== 'Todos'
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando um novo evento"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEventos.map((evento) => (
            <Card key={evento.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{evento.nome}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusIndicator status={evento.status} className="scale-75" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(evento)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(evento)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    {new Date(evento.data).toLocaleDateString('pt-BR')} - {evento.horarioInicio} às {evento.horarioFim}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {evento.local}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    {evento.quantidadePessoas} pessoas esperadas
                  </div>
                  
                  {/* Características do Evento */}
                  <div className="border-t pt-2 mt-2 space-y-2">
                    {evento.caracteristicas.cardapio?.nome && (
                      <div className="text-sm">
                        <span className="font-medium">Cardápio:</span> {evento.caracteristicas.cardapio.nome}
                      </div>
                    )}
                    
                    {evento.caracteristicas.temBebidas && (
                      <div className="flex items-center text-sm">
                        <Beer className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {evento.caracteristicas.tipoBebidas?.join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {evento.caracteristicas.temCabineFoto && (
                      <div className="flex items-center text-sm">
                        <Camera className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          Cabine de Foto {evento.caracteristicas.tipoCabineFoto === 'propria' ? 'Própria' : 'Externa'}
                        </span>
                      </div>
                    )}
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