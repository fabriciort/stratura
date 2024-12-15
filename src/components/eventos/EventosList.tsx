import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Evento } from '../../types';
import { Calendar, Clock, MapPin, Users, Search, Filter, Edit2, Trash2, AlertCircle, Beer, Camera } from 'lucide-react';
import { LoadingList } from '../ui/loading-list';
import { useToast } from '../../hooks/useToast';

interface EventosListProps {
  onEdit: (evento: Evento) => void;
}

const STATUS = ['Todos', 'Pendentes', 'Confirmados', 'Finalizados'] as const;

export function EventosList({ onEdit }: EventosListProps) {
  const { eventos, deleteEvento } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');

  const handleDelete = async (evento: Evento) => {
    if (window.confirm(`Tem certeza que deseja excluir o evento "${evento.nome}"?`)) {
      try {
        setLoading(true);
        deleteEvento(evento.id);
        toast({
          title: "Evento excluído",
          description: `O evento "${evento.nome}" foi removido com sucesso.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o evento. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getEventoStatus = (evento: Evento) => {
    const hoje = new Date();
    const dataEvento = new Date(evento.data);
    
    if (dataEvento < hoje) return 'Finalizado';
    if (evento.escala) return 'Confirmado';
    return 'Pendente';
  };

  const filteredEventos = eventos.filter((evento) => {
    const matchesSearch = evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.local.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getEventoStatus(evento);
    const matchesStatus = statusFiltro === 'Todos' || status === statusFiltro;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (loading) {
    return <LoadingList count={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nome ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="status">Filtrar por Status</Label>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select
              id="status"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {STATUS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
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
          {filteredEventos.map((evento) => {
            const status = getEventoStatus(evento);
            const statusColor = {
              Pendente: 'text-yellow-500',
              Confirmado: 'text-green-500',
              Finalizado: 'text-blue-500'
            }[status];

            return (
              <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>{evento.nome}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm flex items-center ${statusColor}`}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {status}
                      </span>
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
            );
          })}
        </div>
      )}
    </div>
  );
} 