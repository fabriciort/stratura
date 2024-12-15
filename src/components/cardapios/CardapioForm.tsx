import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Cardapio } from '../../types';
import { Utensils, Plus, Trash2, Tag } from 'lucide-react';

interface CardapioFormProps {
  cardapio?: Cardapio;
  onClose: () => void;
}

interface ItemCardapio {
  nome: string;
  categoria: string;
  quantidade: number;
}

const CATEGORIAS = [
  'Entrada',
  'Prato Principal',
  'Acompanhamento',
  'Sobremesa',
  'Bebida',
  'Aperitivo'
] as const;

export function CardapioForm({ cardapio, onClose }: CardapioFormProps) {
  const { addCardapio, updateCardapio } = useApp();
  const [formData, setFormData] = useState({
    nome: '',
    itens: [] as ItemCardapio[],
    observacoes: ''
  });

  const [novoItem, setNovoItem] = useState<ItemCardapio>({
    nome: '',
    categoria: '',
    quantidade: 1
  });

  useEffect(() => {
    if (cardapio) {
      setFormData({
        ...cardapio,
        observacoes: cardapio.observacoes || ''
      });
    }
  }, [cardapio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.itens.length === 0) {
      alert('Adicione pelo menos um item ao cardápio');
      return;
    }
    
    if (cardapio) {
      updateCardapio(cardapio.id, formData);
    } else {
      addCardapio(formData);
    }
    
    onClose();
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNovoItemChange = (field: keyof ItemCardapio, value: string | number) => {
    setNovoItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adicionarItem = () => {
    if (!novoItem.nome || !novoItem.categoria) {
      alert('Preencha todos os campos do item');
      return;
    }

    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, novoItem]
    }));

    setNovoItem({
      nome: '',
      categoria: '',
      quantidade: 1
    });
  };

  const removerItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Utensils className="h-5 w-5" />
          <span>{cardapio ? 'Editar' : 'Novo'} Cardápio</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Cardápio</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Itens do Cardápio</Label>
            
            <div className="grid gap-4 p-4 border rounded-lg">
              <div className="grid gap-4 md:grid-cols-[2fr,1fr,auto,auto]">
                <div className="space-y-2">
                  <Label htmlFor="itemNome">Nome do Item</Label>
                  <Input
                    id="itemNome"
                    value={novoItem.nome}
                    onChange={(e) => handleNovoItemChange('nome', e.target.value)}
                    placeholder="Ex: Arroz Branco"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemCategoria">Categoria</Label>
                  <select
                    id="itemCategoria"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={novoItem.categoria}
                    onChange={(e) => handleNovoItemChange('categoria', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemQuantidade">Qtd.</Label>
                  <Input
                    id="itemQuantidade"
                    type="number"
                    min="1"
                    value={novoItem.quantidade}
                    onChange={(e) => handleNovoItemChange('quantidade', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={adicionarItem}
                    size="sm"
                    className="mb-0.5"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {formData.itens.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{item.categoria}</span>
                      </div>
                      <div className="text-sm font-medium">{item.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        Qtd: {item.quantidade}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <textarea
              id="observacoes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {cardapio ? 'Salvar' : 'Criar'} Cardápio
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 