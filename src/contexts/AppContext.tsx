import { createContext, useContext, useState, ReactNode } from 'react';
import { Pessoa, Evento, Escala } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  pessoas: Pessoa[];
  eventos: Evento[];
  escalas: Escala[];
  addPessoa: (pessoa: Omit<Pessoa, 'id'>) => void;
  updatePessoa: (id: string, pessoa: Partial<Pessoa>) => void;
  deletePessoa: (id: string) => void;
  addEvento: (evento: Omit<Evento, 'id'>) => void;
  updateEvento: (id: string, evento: Partial<Evento>) => void;
  deleteEvento: (id: string) => void;
  addEscala: (escala: Omit<Escala, 'id'>) => void;
  updateEscala: (id: string, escala: Partial<Escala>) => void;
  deleteEscala: (id: string) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [escalas, setEscalas] = useState<Escala[]>([]);

  const addPessoa = (pessoa: Omit<Pessoa, 'id'>) => {
    setPessoas(prev => [...prev, { ...pessoa, id: uuidv4() }]);
  };

  const updatePessoa = (id: string, pessoa: Partial<Pessoa>) => {
    setPessoas(prev => prev.map(p => p.id === id ? { ...p, ...pessoa } : p));
  };

  const deletePessoa = (id: string) => {
    setPessoas(prev => prev.filter(p => p.id !== id));
  };

  const addEvento = (evento: Omit<Evento, 'id'>) => {
    setEventos(prev => [...prev, { ...evento, id: uuidv4() }]);
  };

  const updateEvento = (id: string, evento: Partial<Evento>) => {
    setEventos(prev => prev.map(e => e.id === id ? { ...e, ...evento } : e));
  };

  const deleteEvento = (id: string) => {
    setEventos(prev => prev.filter(e => e.id !== id));
    // Remover escalas associadas ao evento
    setEscalas(prev => prev.filter(e => e.eventoId !== id));
  };

  const addEscala = (escala: Omit<Escala, 'id'>) => {
    setEscalas(prev => [...prev, { ...escala, id: uuidv4() }]);
  };

  const updateEscala = (id: string, escala: Partial<Escala>) => {
    setEscalas(prev => prev.map(e => e.id === id ? { ...e, ...escala } : e));
  };

  const deleteEscala = (id: string) => {
    setEscalas(prev => prev.filter(e => e.id !== id));
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