import { Settings } from 'lucide-react';
import { WhatsappConfig } from '../../components/configuracoes/WhatsappConfig';

export function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <div className="grid gap-6">
        <WhatsappConfig />
      </div>
    </div>
  );
} 