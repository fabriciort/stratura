import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar, AlertCircle, Clock, Plus, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { cn } from '../../lib/utils';
import { StatusIndicator } from '../../components/ui/status-indicator';

export function DashboardPage() {
  const { eventos, escalas } = useApp();
  const navigate = useNavigate();

  const eventosAtivos = eventos.filter(e => {
    const dataEvento = new Date(e.data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Reseta o horário para comparar apenas as datas
    
    return (
      dataEvento >= hoje || // Eventos futuros
      e.status === 'em_andamento' || // Eventos em andamento
      (e.status === 'pendente' && dataEvento.toDateString() === hoje.toDateString()) // Eventos pendentes de hoje
    );
  });

  const escalasPendentes = escalas.filter(e => e.status === 'rascunho');
  const proximosEventos = eventosAtivos
    .sort((a, b) => {
      // Prioriza eventos em andamento
      if (a.status === 'em_andamento' && b.status !== 'em_andamento') return -1;
      if (b.status === 'em_andamento' && a.status !== 'em_andamento') return 1;
      // Depois ordena por data
      return new Date(a.data).getTime() - new Date(b.data).getTime();
    })
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stratura</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie sua equipe e eventos de forma eficiente.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/eventos/novo')}
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Eventos programados para os próximos dias
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => navigate('/eventos')}
              >
                Ver todos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {proximosEventos.length > 0 ? (
              <div className="space-y-4">
                {proximosEventos.map(evento => (
                  <div
                    key={evento.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer",
                      "border border-transparent hover:border-primary/20 hover:bg-primary/5",
                      "hover:shadow-md hover:-translate-y-0.5"
                    )}
                    onClick={() => navigate(`/eventos/${evento.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{evento.nome}</p>
                          <StatusIndicator status={evento.status} className="scale-75" />
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {new Date(evento.data).toLocaleDateString('pt-BR')} - {evento.horarioInicio}
                        </div>
                      </div>
                    </div>
                    {!evento.escala && (
                      <div className="flex items-center text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Escala Pendente
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Calendar className="h-8 w-8 mb-2" />
                <p>Nenhum evento programado</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Escalas Pendentes</CardTitle>
                <CardDescription>
                  Escalas que precisam ser definidas
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => navigate('/escalas')}
              >
                Ver todas
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {escalasPendentes.length > 0 ? (
              <div className="space-y-4">
                {escalasPendentes.slice(0, 4).map(escala => {
                  const evento = eventos.find(e => e.id === escala.eventoId);
                  if (!evento) return null;

                  return (
                    <div
                      key={escala.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer",
                        "border border-transparent hover:border-primary/20 hover:bg-primary/5",
                        "hover:shadow-md hover:-translate-y-0.5"
                      )}
                      onClick={() => navigate(`/escalas/${escala.id}`)}
                    >
                      <div>
                        <p className="font-medium">{evento.nome}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {new Date(evento.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        Definir
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>Nenhuma escala pendente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 