import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Pessoa } from '../../types';
import { User, Phone, Mail, Briefcase, Calendar } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

interface PessoaFormProps {
  pessoa?: Pessoa;
  onClose: () => void;
}

export function PessoaForm({ pessoa, onClose }: PessoaFormProps) {
  const { addPessoa, updatePessoa } = useApp();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    funcaoPrincipal: '',
    funcaoSecundaria: '',
    disponibilidade: {
      dias: [] as string[],
      periodos: [] as string[]
    },
    observacoes: ''
  });

  useEffect(() => {
    if (pessoa) {
      setFormData({
        ...pessoa,
        funcaoSecundaria: pessoa.funcaoSecundaria || '',
        observacoes: pessoa.observacoes || ''
      });
    }
  }, [pessoa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pessoaData = {
        ...formData,
        disponibilidade: {
          dias: formData.disponibilidade.dias || [],
          periodos: formData.disponibilidade.periodos || []
        },
        funcaoSecundaria: formData.funcaoSecundaria || undefined,
        observacoes: formData.observacoes || undefined
      };
      
      if (pessoa) {
        await updatePessoa(pessoa.id, {
          ...pessoaData,
          updatedAt: new Date()
        });
      } else {
        await addPessoa({
          ...pessoaData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    const fields = field.split('.');
    if (fields.length === 1) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        disponibilidade: {
          ...prev.disponibilidade,
          [fields[1]]: value
        }
      }));
    }
  };

  const handleDisponibilidadeChange = (tipo: 'dias' | 'periodos', valor: string) => {
    setFormData(prev => ({
      ...prev,
      disponibilidade: {
        ...prev.disponibilidade,
        [tipo]: prev.disponibilidade[tipo].includes(valor)
          ? prev.disponibilidade[tipo].filter(v => v !== valor)
          : [...prev.disponibilidade[tipo], valor]
      }
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>{pessoa ? 'Editar' : 'Nova'} Pessoa</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="funcaoPrincipal">Função Principal</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="funcaoPrincipal"
                  value={formData.funcaoPrincipal}
                  onChange={(e) => handleChange('funcaoPrincipal', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funcaoSecundaria">Função Secundária (opcional)</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="funcaoSecundaria"
                value={formData.funcaoSecundaria}
                onChange={(e) => handleChange('funcaoSecundaria', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Disponibilidade</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Dias da Semana</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'].map((dia) => (
                    <div key={dia} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dia-${dia}`}
                        checked={formData.disponibilidade.dias.includes(dia)}
                        onCheckedChange={() => handleDisponibilidadeChange('dias', dia)}
                      />
                      <Label htmlFor={`dia-${dia}`}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Períodos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['manhã', 'tarde', 'noite'].map((periodo) => (
                    <div key={periodo} className="flex items-center space-x-2">
                      <Checkbox
                        id={`periodo-${periodo}`}
                        checked={formData.disponibilidade.periodos.includes(periodo)}
                        onCheckedChange={() => handleDisponibilidadeChange('periodos', periodo)}
                      />
                      <Label htmlFor={`periodo-${periodo}`}>{periodo.charAt(0).toUpperCase() + periodo.slice(1)}</Label>
                    </div>
                  ))}
                </div>
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
            {pessoa ? 'Salvar' : 'Criar'} Pessoa
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 