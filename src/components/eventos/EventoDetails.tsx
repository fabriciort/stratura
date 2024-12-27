import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Evento } from '../../types';
import { Calendar, Clock, MapPin, Users, Beer, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Progress } from '../ui/progress';
import { StatusIndicator } from '../ui/status-indicator';
import { useToast } from '../../hooks/use-toast';

interface EventoDetailsProps {
  evento: Evento;
  onEdit: () => void;
  onAddEscala: () => void;
  onGerenciarPessoas: () => void;
}

export function EventoDetails({ evento, onEdit, onAddEscala, onGerenciarPessoas }: EventoDetailsProps) {
  const { updateEvento } = useApp();
  const { toast } = useToast();

  const getProgressoIcon = (concluido: boolean) => {
    return concluido ? (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-yellow-500" />
    );
  };

  const calcularProgressoTotal = () => {
    const steps = Object.values(evento.progresso);
    const concluidos = steps.filter(Boolean).length;
    return (concluidos / steps.length) * 100;
  };

  const handleToggleProgresso = async (campo: keyof Evento['progresso']) => {
    try {
      const novoProgresso = {
        ...evento.progresso,
        [campo]: !evento.progresso[campo]
      };

      let novoStatus = evento.status;

      // Atualiza o status baseado no progresso
      if (campo === 'emAndamento' && !evento.progresso.emAndamento) {
        novoStatus = 'em_andamento';
      } else if (Object.values(novoProgresso).every(Boolean)) {
        novoStatus = 'finalizado';
      } else if (novoStatus === 'finalizado' && !Object.values(novoProgresso).every(Boolean)) {
        novoStatus = 'em_andamento';
      }

      await updateEvento(evento.id, {
        progresso: novoProgresso,
        status: novoStatus,
        updatedAt: new Date()
      });

      toast({
        title: "Sucesso",
        description: "Progresso atualizado com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o progresso",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{evento.nome}</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <StatusIndicator status={evento.status} />
              <Button variant="outline" size="sm" onClick={onGerenciarPessoas}>
                Gerenciar Pessoas
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit}>
                Editar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
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
            </div>

            <div className="space-y-3">
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

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Progresso do Evento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Progress value={calcularProgressoTotal()} className="h-2" />
                </div>
                <span className="ml-4 text-sm text-muted-foreground">
                  {Math.round(calcularProgressoTotal())}%
                </span>
              </div>

              <div className="grid gap-2">
                <Button
                  variant="ghost"
                  className={cn("justify-start", {
                    "hover:bg-green-50": evento.progresso.escalaCompleta
                  })}
                  onClick={() => handleToggleProgresso('escalaCompleta')}
                >
                  {getProgressoIcon(evento.progresso.escalaCompleta)}
                  <span className="ml-2">Escala Completa</span>
                </Button>

                <Button
                  variant="ghost"
                  className={cn("justify-start", {
                    "hover:bg-green-50": evento.progresso.equipePronta
                  })}
                  onClick={() => handleToggleProgresso('equipePronta')}
                >
                  {getProgressoIcon(evento.progresso.equipePronta)}
                  <span className="ml-2">Equipe Pronta</span>
                </Button>

                <Button
                  variant="ghost"
                  className={cn("justify-start", {
                    "hover:bg-green-50": evento.progresso.materiaisPreparados
                  })}
                  onClick={() => handleToggleProgresso('materiaisPreparados')}
                >
                  {getProgressoIcon(evento.progresso.materiaisPreparados)}
                  <span className="ml-2">Materiais Preparados</span>
                </Button>

                <Button
                  variant="ghost"
                  className={cn("justify-start", {
                    "hover:bg-green-50": evento.progresso.checklistConcluido
                  })}
                  onClick={() => handleToggleProgresso('checklistConcluido')}
                >
                  {getProgressoIcon(evento.progresso.checklistConcluido)}
                  <span className="ml-2">Checklist Concluído</span>
                </Button>

                <Button
                  variant="ghost"
                  className={cn("justify-start", {
                    "hover:bg-green-50": evento.progresso.emAndamento
                  })}
                  onClick={() => handleToggleProgresso('emAndamento')}
                >
                  {getProgressoIcon(evento.progresso.emAndamento)}
                  <span className="ml-2">Em Andamento</span>
                </Button>

                <Button
                  variant="ghost"
                  className={cn("justify-start", {
                    "hover:bg-green-50": evento.progresso.finalizado
                  })}
                  onClick={() => handleToggleProgresso('finalizado')}
                >
                  {getProgressoIcon(evento.progresso.finalizado)}
                  <span className="ml-2">Finalizado</span>
                </Button>
              </div>
            </div>
          </div>

          {!evento.escala && (
            <div className="flex justify-center pt-4 border-t">
              <Button onClick={onAddEscala} className="w-full sm:w-auto">
                Definir Escala
              </Button>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Pessoas Escaladas
            </h3>
            {evento.pessoasEscaladas && evento.pessoasEscaladas.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {evento.pessoasEscaladas.map((pessoa) => (
                  <Card key={pessoa.id} className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="font-medium">{pessoa.nome}</p>
                        <p className="text-sm text-muted-foreground">{pessoa.funcao}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma pessoa escalada ainda.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 