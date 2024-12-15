import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Command } from 'cmdk';
import { Search, Calendar, Users, Utensils, ClipboardList } from 'lucide-react';

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pessoas, eventos, cardapios, escalas } = useApp();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (value: string) => {
    setOpen(false);
    navigate(value);
  };

  return (
    <>
      <button
        className="hidden md:flex items-center h-9 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Buscar...</span>
        <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span>⌘</span>K
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      >
        <div className="fixed inset-x-0 top-1/4 mx-auto max-w-2xl rounded-xl border bg-background p-4 shadow-lg">
          <Command.Input
            placeholder="O que você está procurando?"
            className="w-full border-none bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
          />

          <Command.List className="mt-4 max-h-[300px] overflow-y-auto">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado.
            </Command.Empty>

            {pessoas.length > 0 && (
              <Command.Group heading="Pessoas">
                {pessoas.map((pessoa) => (
                  <Command.Item
                    key={pessoa.id}
                    value={`/pessoas/${pessoa.id}`}
                    onSelect={handleSelect}
                    className="flex items-center px-2 py-1 rounded-md hover:bg-accent cursor-pointer"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>{pessoa.nome}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {pessoa.funcaoPrincipal}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {eventos.length > 0 && (
              <Command.Group heading="Eventos">
                {eventos.map((evento) => (
                  <Command.Item
                    key={evento.id}
                    value={`/eventos/${evento.id}`}
                    onSelect={handleSelect}
                    className="flex items-center px-2 py-1 rounded-md hover:bg-accent cursor-pointer"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{evento.nome}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {new Date(evento.data).toLocaleDateString('pt-BR')}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {cardapios.length > 0 && (
              <Command.Group heading="Cardápios">
                {cardapios.map((cardapio) => (
                  <Command.Item
                    key={cardapio.id}
                    value={`/cardapios/${cardapio.id}`}
                    onSelect={handleSelect}
                    className="flex items-center px-2 py-1 rounded-md hover:bg-accent cursor-pointer"
                  >
                    <Utensils className="mr-2 h-4 w-4" />
                    <span>{cardapio.nome}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {cardapio.itens.length} itens
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {escalas.length > 0 && (
              <Command.Group heading="Escalas">
                {escalas.map((escala) => {
                  const evento = eventos.find(e => e.id === escala.eventoId);
                  return (
                    <Command.Item
                      key={escala.id}
                      value={`/escalas/${escala.id}`}
                      onSelect={handleSelect}
                      className="flex items-center px-2 py-1 rounded-md hover:bg-accent cursor-pointer"
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <span>Escala - {evento?.nome}</span>
                      <span className="ml-2 text-sm text-muted-foreground capitalize">
                        {escala.status}
                      </span>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}

            <Command.Group heading="Ações Rápidas">
              <Command.Item
                value="/pessoas/novo"
                onSelect={handleSelect}
                className="flex items-center px-2 py-1 rounded-md hover:bg-accent cursor-pointer"
              >
                <Users className="mr-2 h-4 w-4" />
                Nova Pessoa
              </Command.Item>
              <Command.Item
                value="/eventos/novo"
                onSelect={handleSelect}
                className="flex items-center px-2 py-1 rounded-md hover:bg-accent cursor-pointer"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Novo Evento
              </Command.Item>
              <Command.Item
                value="/cardapios/novo"
                onSelect={handleSelect}
                className="flex items-center px-2 py-1 rounded-md hover:bg-accent cursor-pointer"
              >
                <Utensils className="mr-2 h-4 w-4" />
                Novo Cardápio
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
} 