import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Calendar, Users, ClipboardList, Filter, Download, TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

type RelatorioTipo = 'eventos' | 'equipe' | 'escalas';

export function RelatoriosDetalhados() {
  const { eventos, pessoas, escalas } = useApp();
  const [tipoRelatorio, setTipoRelatorio] = useState<RelatorioTipo>('eventos');
  const [periodoFiltro, setPeriodoFiltro] = useState('30'); // dias

  const getEventosStats = () => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - Number(periodoFiltro));
    
    const eventosFiltrados = eventos.filter(evento => 
      new Date(evento.data) >= dataLimite
    );

    const totalPessoas = eventosFiltrados.reduce((acc, evento) => acc + evento.quantidadePessoas, 0);
    const mediaParticipantes = totalPessoas / (eventosFiltrados.length || 1);

    const eventosPorDiaSemana = eventosFiltrados.reduce((acc, evento) => {
      const diaSemana = new Date(evento.data).toLocaleDateString('pt-BR', { weekday: 'long' });
      acc[diaSemana] = (acc[diaSemana] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: eventosFiltrados.length,
      mediaParticipantes: Math.round(mediaParticipantes),
      totalPessoas,
      porTipo: eventosFiltrados.reduce((acc, evento) => {
        acc[evento.tipo] = (acc[evento.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      porDiaSemana: eventosPorDiaSemana
    };
  };

  const getEquipeStats = () => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - Number(periodoFiltro));

    const pessoasAtivas = new Set(
      escalas.filter(escala => {
        const evento = eventos.find(e => e.id === escala.eventoId);
        return evento && new Date(evento.data) >= dataLimite;
      }).flatMap(escala => escala.pessoas.map(p => p.pessoaId))
    );

    const participacoesPorPessoa = escalas.reduce((acc, escala) => {
      escala.pessoas.forEach(p => {
        acc[p.pessoaId] = (acc[p.pessoaId] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const pessoasMaisAtivas = Object.entries(participacoesPorPessoa)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([pessoaId, participacoes]) => ({
        pessoa: pessoas.find(p => p.id === pessoaId)!,
        participacoes
      }));

    const funcoesPrincipais = pessoas.reduce((acc, pessoa) => {
      acc[pessoa.funcaoPrincipal] = (acc[pessoa.funcaoPrincipal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: pessoas.length,
      ativos: pessoasAtivas.size,
      porFuncao: funcoesPrincipais,
      pessoasMaisAtivas,
      taxaAtividade: Math.round((pessoasAtivas.size / pessoas.length) * 100)
    };
  };

  const getEscalasStats = () => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - Number(periodoFiltro));

    const escalasFiltradas = escalas.filter(escala => {
      const evento = eventos.find(e => e.id === escala.eventoId);
      return evento && new Date(evento.data) >= dataLimite;
    });

    const pessoasPorEscala = escalasFiltradas.map(escala => ({
      escala,
      evento: eventos.find(e => e.id === escala.eventoId)!,
      quantidade: escala.pessoas.length
    }));

    return {
      total: escalasFiltradas.length,
      porStatus: escalasFiltradas.reduce((acc, escala) => {
        acc[escala.status] = (acc[escala.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      mediaPessoasPorEscala: Math.round(
        escalasFiltradas.reduce((acc, escala) => acc + escala.pessoas.length, 0) / 
        (escalasFiltradas.length || 1)
      ),
      pessoasPorEscala: pessoasPorEscala.sort((a, b) => b.quantidade - a.quantidade).slice(0, 5)
    };
  };

  const handleExportarRelatorio = () => {
    // TODO: Implementar exportação de relatórios
    console.log(`Exportando relatório detalhado: ${tipoRelatorio}`);
  };

  const renderConteudo = () => {
    switch (tipoRelatorio) {
      case 'eventos':
        const eventosStats = getEventosStats();
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{eventosStats.total}</div>
                  <p className="text-xs text-muted-foreground">No período selecionado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Média de Participantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{eventosStats.mediaParticipantes}</div>
                  <p className="text-xs text-muted-foreground">Pessoas por evento</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Participações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{eventosStats.totalPessoas}</div>
                  <p className="text-xs text-muted-foreground">Soma de todas as participações</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Eventos por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(eventosStats.porTipo).map(([tipo, quantidade]) => (
                      <div 
                        key={tipo} 
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-primary/5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{tipo}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{quantidade}</span>
                          <span className="text-sm text-muted-foreground">eventos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Dia da Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(eventosStats.porDiaSemana).map(([dia, quantidade]) => (
                      <div 
                        key={dia} 
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-primary/5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium capitalize">{dia}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{quantidade}</span>
                          <span className="text-sm text-muted-foreground">eventos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'equipe':
        const equipeStats = getEquipeStats();
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Profissionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{equipeStats.total}</div>
                  <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Atividade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">{equipeStats.taxaAtividade}%</div>
                    {equipeStats.taxaAtividade >= 70 ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {equipeStats.ativos} pessoas ativas no período
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Função</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(equipeStats.porFuncao).map(([funcao, quantidade]) => (
                      <div 
                        key={funcao} 
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-primary/5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{funcao}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{quantidade}</span>
                          <span className="text-sm text-muted-foreground">pessoas</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pessoas Mais Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {equipeStats.pessoasMaisAtivas.map(({ pessoa, participacoes }) => (
                      <div 
                        key={pessoa.id} 
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-primary/5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{pessoa.nome}</p>
                            <p className="text-sm text-muted-foreground">{pessoa.funcaoPrincipal}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{participacoes}</span>
                          <span className="text-sm text-muted-foreground">participações</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'escalas':
        const escalasStats = getEscalasStats();
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Escalas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{escalasStats.total}</div>
                  <p className="text-xs text-muted-foreground">No período selecionado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Média de Pessoas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{escalasStats.mediaPessoasPorEscala}</div>
                  <p className="text-xs text-muted-foreground">Por escala</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Status das Escalas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(escalasStats.porStatus).map(([status, quantidade]) => (
                      <div 
                        key={status} 
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-primary/5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <ClipboardList className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium capitalize">{status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{quantidade}</span>
                          <span className="text-sm text-muted-foreground">escalas</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maiores Equipes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escalasStats.pessoasPorEscala.map(({ escala, evento, quantidade }) => (
                      <div 
                        key={escala.id} 
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-primary/5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{evento.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(evento.data).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{quantidade}</span>
                          <span className="text-sm text-muted-foreground">pessoas</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <Label>Tipo de Relatório</Label>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value as RelatorioTipo)}
              className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="eventos">Eventos</option>
              <option value="equipe">Equipe</option>
              <option value="escalas">Escalas</option>
            </select>
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Label>Período</Label>
          <select
            value={periodoFiltro}
            onChange={(e) => setPeriodoFiltro(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="180">Últimos 180 dias</option>
            <option value="365">Último ano</option>
          </select>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportarRelatorio}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {renderConteudo()}
    </div>
  );
} 