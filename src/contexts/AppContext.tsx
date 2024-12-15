import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Pessoa, Evento, Escala } from '../types';
import { db, dbHelpers } from '../lib/db';
import { useToast } from '../hooks/use-toast';

interface AppContextType {
  pessoas: Pessoa[];
  eventos: Evento[];
  escalas: Escala[];
  addPessoa: (pessoa: Omit<Pessoa, 'id'>) => Promise<void>;
  updatePessoa: (id: number, pessoa: Partial<Pessoa>) => Promise<void>;
  deletePessoa: (id: number) => Promise<void>;
  addEvento: (evento: Omit<Evento, 'id'>) => Promise<void>;
  updateEvento: (id: number, evento: Partial<Evento>) => Promise<void>;
  deleteEvento: (id: number) => Promise<void>;
  addEscala: (escala: Omit<Escala, 'id'>) => Promise<void>;
  updateEscala: (id: number, escala: Partial<Escala>) => Promise<void>;
  deleteEscala: (id: number) => Promise<void>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const { toast } = useToast();

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        const [pessoasData, eventosData, escalasData] = await Promise.all([
          dbHelpers.getPessoas(),
          dbHelpers.getEventos(),
          dbHelpers.getEscalas()
        ]);

        setPessoas(pessoasData);
        setEventos(eventosData);
        setEscalas(escalasData);
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do banco local",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, []);

  const addPessoa = async (pessoa: Omit<Pessoa, 'id'>) => {
    try {
      const id = await dbHelpers.addPessoa(pessoa);
      const novaPessoa = { ...pessoa, id } as Pessoa;
      setPessoas(prev => [...prev, novaPessoa]);
      toast({
        title: "Sucesso",
        description: "Pessoa adicionada com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a pessoa",
        variant: "destructive",
      });
    }
  };

  const updatePessoa = async (id: number, pessoa: Partial<Pessoa>) => {
    try {
      await dbHelpers.updatePessoa(id, pessoa);
      setPessoas(prev => prev.map(p => p.id === id ? { ...p, ...pessoa } : p));
      toast({
        title: "Sucesso",
        description: "Pessoa atualizada com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a pessoa",
        variant: "destructive",
      });
    }
  };

  const deletePessoa = async (id: number) => {
    try {
      await dbHelpers.deletePessoa(id);
      setPessoas(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Pessoa removida com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a pessoa",
        variant: "destructive",
      });
    }
  };

  const addEvento = async (evento: Omit<Evento, 'id'>) => {
    try {
      const id = await dbHelpers.addEvento(evento);
      const novoEvento = { ...evento, id } as Evento;
      setEventos(prev => [...prev, novoEvento]);
      toast({
        title: "Sucesso",
        description: "Evento adicionado com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o evento",
        variant: "destructive",
      });
    }
  };

  const updateEvento = async (id: number, evento: Partial<Evento>) => {
    try {
      await dbHelpers.updateEvento(id, evento);
      setEventos(prev => prev.map(e => e.id === id ? { ...e, ...evento } : e));
      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento",
        variant: "destructive",
      });
    }
  };

  const deleteEvento = async (id: number) => {
    try {
      await dbHelpers.deleteEvento(id);
      setEventos(prev => prev.filter(e => e.id !== id));
      // Remover escalas associadas ao evento
      const escalasDoEvento = escalas.filter(e => e.eventoId === id);
      await Promise.all(escalasDoEvento.map(e => dbHelpers.deleteEscala(e.id)));
      setEscalas(prev => prev.filter(e => e.eventoId !== id));
      toast({
        title: "Sucesso",
        description: "Evento removido com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o evento",
        variant: "destructive",
      });
    }
  };

  const addEscala = async (escala: Omit<Escala, 'id'>) => {
    try {
      const id = await dbHelpers.addEscala(escala);
      const novaEscala = { ...escala, id } as Escala;
      setEscalas(prev => [...prev, novaEscala]);
      toast({
        title: "Sucesso",
        description: "Escala adicionada com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a escala",
        variant: "destructive",
      });
    }
  };

  const updateEscala = async (id: number, escala: Partial<Escala>) => {
    try {
      await dbHelpers.updateEscala(id, escala);
      setEscalas(prev => prev.map(e => e.id === id ? { ...e, ...escala } : e));
      toast({
        title: "Sucesso",
        description: "Escala atualizada com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a escala",
        variant: "destructive",
      });
    }
  };

  const deleteEscala = async (id: number) => {
    try {
      await dbHelpers.deleteEscala(id);
      setEscalas(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Sucesso",
        description: "Escala removida com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a escala",
        variant: "destructive",
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        pessoas,
        eventos,
        escalas,
        addPessoa,
        updatePessoa,
        deletePessoa,
        addEvento,
        updateEvento,
        deleteEvento,
        addEscala,
        updateEscala,
        deleteEscala,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 