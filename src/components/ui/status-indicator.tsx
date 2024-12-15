import { cn } from "../../lib/utils";

interface StatusIndicatorProps {
  status: 'pendente' | 'em_andamento' | 'finalizado' | 'cancelado';
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "relative flex h-3 w-3",
          {
            "animate-[pulse_2s_ease-in-out_infinite]": status === 'em_andamento'
          }
        )}
      >
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full",
            {
              "bg-yellow-500/75": status === 'pendente',
              "bg-green-500/75 animate-[ping_2s_ease-in-out_infinite]": status === 'em_andamento',
              "bg-blue-500/75": status === 'finalizado',
              "bg-red-500/75": status === 'cancelado'
            }
          )}
        />
        <span
          className={cn(
            "relative inline-flex rounded-full h-3 w-3",
            {
              "bg-yellow-500": status === 'pendente',
              "bg-green-500": status === 'em_andamento',
              "bg-blue-500": status === 'finalizado',
              "bg-red-500": status === 'cancelado'
            }
          )}
        />
      </span>
      <span className={cn(
        "text-sm font-medium",
        {
          "text-yellow-600": status === 'pendente',
          "text-green-600": status === 'em_andamento',
          "text-blue-600": status === 'finalizado',
          "text-red-600": status === 'cancelado'
        }
      )}>
        {status === 'pendente' && 'Pendente'}
        {status === 'em_andamento' && 'Em Andamento'}
        {status === 'finalizado' && 'Finalizado'}
        {status === 'cancelado' && 'Cancelado'}
      </span>
    </div>
  );
} 