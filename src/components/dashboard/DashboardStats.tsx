import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/card';
import { Calendar, Users, ClipboardList, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function DashboardStats() {
  const { pessoas, eventos, escalas } = useApp();

  const getEventosStats = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const ultimoMes = new Date();
    ultimoMes.setMonth(ultimoMes.getMonth() - 1);
    const doisMesesAtras = new Date();
    doisMesesAtras.setMonth(doisMesesAtras.getMonth() - 2);

    const eventosAtivos = eventos.filter(e => {
      const dataEvento = new Date(e.data);
      return (
        dataEvento >= hoje ||
        e.status === 'em_andamento' ||
        (e.status === 'pendente' && dataEvento.toDateString() === hoje.toDateString())
      );
    });

    const eventosUltimoMes = eventos.filter(e => {
      const data = new Date(e.data);
      return data >= ultimoMes && data <= hoje;
    });

    const eventosDoisMesesAtras = eventos.filter(e => {
      const data = new Date(e.data);
      return data >= doisMesesAtras && data < ultimoMes;
    });

    return {
      total: eventos.length,
      ativos: eventosAtivos.length,
      ultimoMes: eventosUltimoMes.length,
      crescimento: eventosUltimoMes.length >= eventosDoisMesesAtras.length
    };
  };

  const getPessoasStats = () => {
    const hoje = new Date();
    const ultimoMes = new Date();
    ultimoMes.setMonth(ultimoMes.getMonth() - 1);

    const pessoasAtivasHoje = new Set(
      escalas.filter(e => new Date(e.createdAt) >= ultimoMes).flatMap(escala => escala.pessoas.map(p => p.pessoaId))
    ).size;

    const pessoasAtivasAntes = new Set(
      escalas.filter(e => new Date(e.createdAt) < ultimoMes).flatMap(escala => escala.pessoas.map(p => p.pessoaId))
    ).size;

    return {
      total: pessoas.length,
      ativas: pessoasAtivasHoje,
      crescimento: pessoasAtivasHoje >= pessoasAtivasAntes
    };
  };

  const getEscalasStats = () => {
    const escalasFinalizadas = escalas.filter(e => e.status === 'finalizada');
    const escalasPendentes = escalas.filter(e => e.status === 'rascunho');

    return {
      total: escalas.length,
      finalizadas: escalasFinalizadas.length,
      pendentes: escalasPendentes.length,
      crescimento: escalasFinalizadas.length > escalasPendentes.length
    };
  };

  const eventosStats = getEventosStats();
  const pessoasStats = getPessoasStats();
  const escalasStats = getEscalasStats();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
      )}>
        <div className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Eventos</h3>
            </div>
            {eventosStats.crescimento ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{eventosStats.total}</p>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4" />
              {eventosStats.ativos} eventos ativos
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {eventosStats.ultimoMes} no último mês
            </p>
          </div>
        </div>
      </Card>

      <Card className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
      )}>
        <div className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Equipe</h3>
            </div>
            {pessoasStats.crescimento ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{pessoasStats.total}</p>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4" />
              {pessoasStats.ativas} pessoas ativas
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round((pessoasStats.ativas / pessoasStats.total) * 100)}% de participação
            </p>
          </div>
        </div>
      </Card>

      <Card className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
      )}>
        <div className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Escalas</h3>
            </div>
            {escalasStats.crescimento ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{escalasStats.total}</p>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4" />
              {escalasStats.finalizadas} escalas finalizadas
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {escalasStats.pendentes} escalas pendentes
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 