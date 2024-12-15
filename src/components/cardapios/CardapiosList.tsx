import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Cardapio } from '../../types';
import { Utensils, Search, Edit2, Trash2, Clock } from 'lucide-react';
import { LoadingList } from '../ui/loading-list';
import { useToast } from '../../hooks/useToast';

interface CardapiosListProps {
  onEdit: (cardapio: Cardapio) => void;
}

export function CardapiosList({ onEdit }: CardapiosListProps) {
  const { cardapios, deleteCardapio } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (cardapio: Cardapio) => {
    if (window.confirm(`Tem certeza que deseja excluir o cardápio "${cardapio.nome}"?`)) {
      try {
        setLoading(true);
        deleteCardapio(cardapio.id);
        toast({
          title: "Cardápio excluído",
          description: `O cardápio "${cardapio.nome}" foi removido com sucesso.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o cardápio. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCardapios = cardapios
    .filter(cardapio => 
      cardapio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cardapio.itens.some(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (loading) {
    return <LoadingList count={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nome, item ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {filteredCardapios.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Utensils className="h-8 w-8 text-muted-foreground" />
            <h3 className="font-semibold">Nenhum cardápio encontrado</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm
                ? "Tente ajustar sua busca"
                : "Comece adicionando um novo cardápio"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCardapios.map((cardapio) => (
            <Card key={cardapio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    <span>{cardapio.nome}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(cardapio)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cardapio)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    {cardapio.itens.length} itens em {new Set(cardapio.itens.map(item => item.categoria)).size} categorias
                  </div>
                  <div className="space-y-2">
                    {Array.from(new Set(cardapio.itens.map(item => item.categoria)))
                      .slice(0, 3)
                      .map(categoria => (
                        <div key={categoria} className="text-sm text-muted-foreground">
                          • {categoria}: {cardapio.itens.filter(item => item.categoria === categoria).length} itens
                        </div>
                      ))}
                    {cardapio.itens.length > 3 && (
                      <div className="text-sm text-muted-foreground">...</div>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground pt-2 border-t">
                    <Clock className="h-3 w-3 mr-1" />
                    Atualizado em {new Date(cardapio.updatedAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 