import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Users, ClipboardList, Download, FileText, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function RelatoriosOverview() {
  const { eventos, pessoas, escalas } = useApp();

  const getEventosRecentes = () => {
    const hoje = new Date();
    return eventos.filter(evento => new Date(evento.data) <= hoje)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5);
  };

  const getEstatisticas = () => {
    const hoje = new Date();
    const ultimoMes = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
    const ultimoTrimestre = new Date(hoje.getFullYear(), hoje.getMonth() - 3, hoje.getDate());
    
    const eventosUltimoMes = eventos.filter(evento => 
      new Date(evento.data) >= ultimoMes && new Date(evento.data) <= hoje
    );

    const eventosUltimoTrimestre = eventos.filter(evento => 
      new Date(evento.data) >= ultimoTrimestre && new Date(evento.data) <= hoje
    );

    const pessoasAtivas = new Set(
      escalas.flatMap(escala => escala.pessoas.map(p => p.pessoaId))
    ).size;

    const escalasFinalizadasMes = escalas.filter(e => {
      const evento = eventos.find(ev => ev.id === e.eventoId);
      return evento && 
        new Date(evento.data) >= ultimoMes && 
        new Date(evento.data) <= hoje && 
        e.status === 'finalizada';
    });

    const mediaParticipantesTrimestre = eventosUltimoTrimestre.reduce((acc, evento) => 
      acc + evento.quantidadePessoas, 0) / (eventosUltimoTrimestre.length || 1);

    return {
      totalEventos: eventos.length,
      eventosUltimoMes: eventosUltimoMes.length,
      crescimentoEventos: eventosUltimoMes.length > (eventos.length / 12), // Comparação com média mensal
      pessoasCadastradas: pessoas.length,
      pessoasAtivas,
      taxaAtividade: (pessoasAtivas / pessoas.length) * 100,
      escalasFinalizadas: escalas.filter(e => e.status === 'finalizada').length,
      escalasFinalizadasMes: escalasFinalizadasMes.length,
      mediaParticipantes: Math.round(mediaParticipantesTrimestre),
      taxaOcupacao: Math.round((escalasFinalizadasMes.length / eventosUltimoMes.length) * 100)
    };
  };

  const estatisticas = getEstatisticas();
  const eventosRecentes = getEventosRecentes();

  const handleExportarRelatorio = (tipo: string) => {
    // TODO: Implementar exportação de relatórios
    console.log(`Exportando relatório: ${tipo}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalEventos}</div>
            <div className="mt-2 flex items-center space-x-2">
              {estatisticas.crescimentoEventos ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p className="text-xs text-muted-foreground">
                {estatisticas.eventosUltimoMes} no último mês
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.pessoasCadastradas}</div>
            <div className="mt-2 flex items-center space-x-2">
              {estatisticas.taxaAtividade >= 70 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p className="text-xs text-muted-foreground">
                {estatisticas.pessoasAtivas} pessoas ativas ({Math.round(estatisticas.taxaAtividade)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalas Finalizadas</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.escalasFinalizadas}</div>
            <div className="mt-2 flex items-center space-x-2">
              {estatisticas.taxaOcupacao >= 80 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p className="text-xs text-muted-foreground">
                Taxa de ocupação: {estatisticas.taxaOcupacao}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.mediaParticipantes}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Por evento no último trimestre
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Eventos Recentes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExportarRelatorio('eventos')}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventosRecentes.map(evento => (
                <div
                  key={evento.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg transition-all",
                    "border border-border/50 hover:border-primary/50 hover:bg-primary/5",
                    "cursor-pointer hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{evento.nome}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {evento.quantidadePessoas} pessoas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal hover:bg-primary/5"
                onClick={() => handleExportarRelatorio('mensal')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Relatório Mensal Completo
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal hover:bg-primary/5"
                onClick={() => handleExportarRelatorio('equipe')}
              >
                <Users className="mr-2 h-4 w-4" />
                Relatório de Equipe
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal hover:bg-primary/5"
                onClick={() => handleExportarRelatorio('escalas')}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Relatório de Escalas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 