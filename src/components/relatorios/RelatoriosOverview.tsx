import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Users, Utensils, ClipboardList, Download, FileText } from 'lucide-react';

export function RelatoriosOverview() {
  const { eventos, pessoas, cardapios, escalas } = useApp();

  const getEventosRecentes = () => {
    const hoje = new Date();
    return eventos.filter(evento => new Date(evento.data) <= hoje)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5);
  };

  const getEstatisticas = () => {
    const hoje = new Date();
    const ultimoMes = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
    
    const eventosUltimoMes = eventos.filter(evento => 
      new Date(evento.data) >= ultimoMes && new Date(evento.data) <= hoje
    );

    const pessoasAtivas = new Set(
      escalas.flatMap(escala => escala.pessoas.map(p => p.pessoaId))
    ).size;

    return {
      totalEventos: eventos.length,
      eventosUltimoMes: eventosUltimoMes.length,
      pessoasCadastradas: pessoas.length,
      pessoasAtivas,
      cardapiosDisponiveis: cardapios.length,
      escalasFinalizadas: escalas.filter(e => e.status === 'finalizada').length
    };
  };

  const estatisticas = getEstatisticas();
  const eventosRecentes = getEventosRecentes();

  const handleExportarRelatorio = (tipo: string) => {
    // Implementar exportação de relatórios
    console.log(`Exportando relatório: ${tipo}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Análise e acompanhamento das operações
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalEventos}</div>
            <p className="text-xs text-muted-foreground">
              {estatisticas.eventosUltimoMes} no último mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.pessoasCadastradas}</div>
            <p className="text-xs text-muted-foreground">
              {estatisticas.pessoasAtivas} pessoas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cardápios</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.cardapiosDisponiveis}</div>
            <p className="text-xs text-muted-foreground">
              Disponíveis para eventos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventosRecentes.map(evento => (
                <div
                  key={evento.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{evento.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {evento.quantidadePessoas} pessoas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Exportar Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExportarRelatorio('eventos')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Relatório de Eventos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExportarRelatorio('equipe')}
              >
                <Users className="mr-2 h-4 w-4" />
                Relatório de Equipe
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExportarRelatorio('escalas')}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Relatório de Escalas
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExportarRelatorio('cardapios')}
              >
                <Utensils className="mr-2 h-4 w-4" />
                Relatório de Cardápios
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => handleExportarRelatorio('completo')}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 