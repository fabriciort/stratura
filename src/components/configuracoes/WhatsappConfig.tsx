import { useWhatsapp } from '../../contexts/WhatsappContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { MessageSquare, Phone, Key } from 'lucide-react';

export function WhatsappConfig() {
  const { config, updateConfig } = useWhatsapp();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Configurações do WhatsApp
        </CardTitle>
        <CardDescription>
          Configure a integração com WhatsApp para enviar notificações e mensagens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Habilitar/Desabilitar WhatsApp */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Habilitar WhatsApp</Label>
            <p className="text-sm text-muted-foreground">
              Ative para permitir o envio de mensagens via WhatsApp
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked: boolean) => updateConfig({ enabled: checked })}
          />
        </div>

        {config.enabled && (
          <>
            {/* Chave da API */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Chave da API
              </Label>
              <Input
                type="password"
                value={config.apiKey || ''}
                onChange={(e) => updateConfig({ apiKey: e.target.value })}
                placeholder="Insira a chave da API do WhatsApp"
              />
              <p className="text-sm text-muted-foreground">
                Obtenha sua chave da API no painel do WhatsApp Business
              </p>
            </div>

            {/* Número do WhatsApp */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Número do WhatsApp
              </Label>
              <Input
                type="tel"
                value={config.phoneNumber || ''}
                onChange={(e) => updateConfig({ phoneNumber: e.target.value })}
                placeholder="Ex: +5511999999999"
              />
              <p className="text-sm text-muted-foreground">
                Número que será usado para enviar as mensagens
              </p>
            </div>

            {/* Mensagem Padrão */}
            <div className="space-y-2">
              <Label>Mensagem Padrão</Label>
              <textarea
                value={config.defaultMessage || ''}
                onChange={(e) => updateConfig({ defaultMessage: e.target.value })}
                placeholder="Mensagem padrão para notificações..."
                className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <p className="text-sm text-muted-foreground">
                Você pode usar variáveis como {'{nome}'}, {'{evento}'}, {'{data}'}, etc.
              </p>
            </div>

            {/* Configurações de Notificação */}
            <div className="space-y-4">
              <Label>Configurações de Notificação</Label>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificar Novo Evento</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar mensagem quando um novo evento for criado
                  </p>
                </div>
                <Switch
                  checked={config.notifyOnNewEvent}
                  onCheckedChange={(checked: boolean) => updateConfig({ notifyOnNewEvent: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificar Atualização de Escala</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar mensagem quando uma escala for atualizada
                  </p>
                </div>
                <Switch
                  checked={config.notifyOnEscalaUpdate}
                  onCheckedChange={(checked: boolean) => updateConfig({ notifyOnEscalaUpdate: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembrete Antes do Evento</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembrete antes do evento
                  </p>
                </div>
                <Switch
                  checked={config.notifyBeforeEvento}
                  onCheckedChange={(checked: boolean) => updateConfig({ notifyBeforeEvento: checked })}
                />
              </div>

              {config.notifyBeforeEvento && (
                <div className="space-y-2">
                  <Label>Horas Antes do Evento</Label>
                  <Input
                    type="number"
                    min="1"
                    max="72"
                    value={config.horasAntesEvento}
                    onChange={(e) => updateConfig({ horasAntesEvento: Number(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Quantas horas antes do evento o lembrete deve ser enviado
                  </p>
                </div>
              )}
            </div>

            {/* Botão de Teste */}
            <div className="pt-4">
              <Button
                onClick={() => {
                  if (config.phoneNumber) {
                    // Enviar mensagem de teste
                    // Aqui você chamaria a função enviarMensagemWhatsapp
                    console.log('Enviando mensagem de teste...');
                  }
                }}
                disabled={!config.phoneNumber}
              >
                Enviar Mensagem de Teste
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 