import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Calendar, Users, Utensils, ClipboardList, Filter } from 'lucide-react';

type RelatorioTipo = 'eventos' | 'equipe' | 'escalas' | 'cardapios';

export function RelatoriosDetalhados() {
  const { eventos, pessoas, cardapios, escalas } = useApp();
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

    return {
      total: eventosFiltrados.length,
      mediaParticipantes: Math.round(mediaParticipantes),
      porTipo: eventosFiltrados.reduce((acc, evento) => {
        acc[evento.tipo] = (acc[evento.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  const getEquipeStats = () => {
    const pessoasAtivas = new Set(
      escalas.filter(escala => {
        const evento = eventos.find(e => e.id === escala.eventoId);
        return evento && new Date(evento.data) >= new Date();
      }).flatMap(escala => escala.pessoas.map(p => p.pessoaId))
    );

    const funcoesPrincipais = pessoas.reduce((acc, pessoa) => {
      acc[pessoa.funcaoPrincipal] = (acc[pessoa.funcaoPrincipal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: pessoas.length,
      ativos: pessoasAtivas.size,
      porFuncao: funcoesPrincipais
    };
  };

  const getEscalasStats = () => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - Number(periodoFiltro));

    const escalasFiltradas = escalas.filter(escala => {
      const evento = eventos.find(e => e.id === escala.eventoId);
      return evento && new Date(evento.data) >= dataLimite;
    });

    return {
      total: escalasFiltradas.length,
      porStatus: escalasFiltradas.reduce((acc, escala) => {
        acc[escala.status] = (acc[escala.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      mediaPessoasPorEscala: Math.round(
        escalasFiltradas.reduce((acc, escala) => acc + escala.pessoas.length, 0) / 
        (escalasFiltradas.length || 1)
      )
    };
  };

  const getCardapiosStats = () => {
    const eventosRecentes = eventos.filter(evento => {
      const data = new Date(evento.data);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - Number(periodoFiltro));
      return data >= dataLimite;
    });

    const cardapiosUsados = eventosRecentes.reduce((acc, evento) => {
      acc[evento.cardapioId] = (acc[evento.cardapioId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: cardapios.length,
      maisUsados: Object.entries(cardapiosUsados)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, count]) => ({
          nome: cardapios.find(c => c.id === id)?.nome || 'Cardápio não encontrado',
          usos: count
        }))
    };
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
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Eventos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(eventosStats.porTipo).map(([tipo, quantidade]) => (
                    <div key={tipo} className="flex justify-between items-center">
                      <span className="text-sm">{tipo}</span>
                      <span className="text-sm font-medium">{quantidade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                  <CardTitle className="text-sm font-medium">Profissionais Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{equipeStats.ativos}</div>
                  <p className="text-xs text-muted-foreground">Em eventos futuros</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Função</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(equipeStats.porFuncao).map(([funcao, quantidade]) => (
                    <div key={funcao} className="flex justify-between items-center">
                      <span className="text-sm">{funcao}</span>
                      <span className="text-sm font-medium">{quantidade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Status das Escalas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(escalasStats.porStatus).map(([status, quantidade]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{status}</span>
                      <span className="text-sm font-medium">{quantidade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'cardapios':
        const cardapiosStats = getCardapiosStats();
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Cardápios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cardapiosStats.total}</div>
                <p className="text-xs text-muted-foreground">Disponíveis no sistema</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cardápios Mais Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cardapiosStats.maisUsados.map(({ nome, usos }) => (
                    <div key={nome} className="flex justify-between items-center">
                      <span className="text-sm">{nome}</span>
                      <span className="text-sm font-medium">{usos} eventos</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="tipoRelatorio">Tipo de Relatório</Label>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select
              id="tipoRelatorio"
              className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value as RelatorioTipo)}
            >
              <option value="eventos">Relatório de Eventos</option>
              <option value="equipe">Relatório de Equipe</option>
              <option value="escalas">Relatório de Escalas</option>
              <option value="cardapios">Relatório de Cardápios</option>
            </select>
          </div>
        </div>
        <div className="w-full md:w-[200px]">
          <Label htmlFor="periodo">Período</Label>
          <select
            id="periodo"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={periodoFiltro}
            onChange={(e) => setPeriodoFiltro(e.target.value)}
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Último ano</option>
          </select>
        </div>
      </div>

      {renderConteudo()}
    </div>
  );
} 