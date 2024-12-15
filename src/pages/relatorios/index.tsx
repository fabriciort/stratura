import { useState } from 'react';
import { RelatoriosOverview } from '../../components/relatorios/RelatoriosOverview';
import { RelatoriosDetalhados } from '../../components/relatorios/RelatoriosDetalhados';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ChartBar, FileText } from 'lucide-react';

type ViewMode = 'overview' | 'detalhado';

export function RelatoriosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Análise e acompanhamento das operações
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            onClick={() => setViewMode('overview')}
          >
            <ChartBar className="mr-2 h-4 w-4" />
            Visão Geral
          </Button>
          <Button
            variant={viewMode === 'detalhado' ? 'default' : 'outline'}
            onClick={() => setViewMode('detalhado')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Relatórios Detalhados
          </Button>
        </div>
      </div>

      <Card className="p-6">
        {viewMode === 'overview' ? (
          <RelatoriosOverview />
        ) : (
          <RelatoriosDetalhados />
        )}
      </Card>
    </div>
  );
} 