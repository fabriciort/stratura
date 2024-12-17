import { AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';

interface ErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorBoundary({ error, resetErrorBoundary }: ErrorBoundaryProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Ops! Algo deu errado</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Desculpe, encontramos um erro ao processar sua solicitação.
          </p>
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error.message}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={resetErrorBoundary} className="w-full">
            Tentar novamente
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 