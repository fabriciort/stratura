import { createContext, useContext, useState, ReactNode } from 'react';
import { Pessoa, Evento, Cardapio, Escala } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  pessoas: Pessoa[];
  eventos: Evento[];
  cardapios: Cardapio[];
  escalas: Escala[];
  addPessoa: (pessoa: Omit<Pessoa, 'id'>) => void;
  updatePessoa: (id: string, pessoa: Partial<Pessoa>) => void;
  deletePessoa: (id: string) => void;
  addEvento: (evento: Omit<Evento, 'id'>) => void;
  updateEvento: (id: string, evento: Partial<Evento>) => void;
  deleteEvento: (id: string) => void;
  addCardapio: (cardapio: Omit<Cardapio, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCardapio: (id: string, cardapio: Partial<Cardapio>) => void;
  deleteCardapio: (id: string) => void;
  addEscala: (escala: Omit<Escala, 'id'>) => void;
  updateEscala: (id: string, escala: Partial<Escala>) => void;
  deleteEscala: (id: string) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cardapios, setCardapios] = useState<Cardapio[]>([]);
  const [escalas, setEscalas] = useState<Escala[]>([]);

  const addPessoa = (pessoa: Omit<Pessoa, 'id'>) => {
    const novaPessoa = { ...pessoa, id: generateId() };
    setPessoas(prev => [...prev, novaPessoa]);
  };

  const updatePessoa = (id: string, pessoa: Partial<Pessoa>) => {
    setPessoas(prev => prev.map(p => p.id === id ? { ...p, ...pessoa } : p));
  };

  const deletePessoa = (id: string) => {
    setPessoas(prev => prev.filter(p => p.id !== id));
  };

  const addEvento = (evento: Omit<Evento, 'id'>) => {
    const novoEvento = { ...evento, id: generateId() };
    setEventos(prev => [...prev, novoEvento]);
  };

  const updateEvento = (id: string, evento: Partial<Evento>) => {
    setEventos(prev => prev.map(e => e.id === id ? { ...e, ...evento } : e));
  };

  const deleteEvento = (id: string) => {
    setEventos(prev => prev.filter(e => e.id !== id));
  };

  const addCardapio = (cardapio: Omit<Cardapio, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const novoCardapio: Cardapio = {
      ...cardapio,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    setCardapios(prev => [...prev, novoCardapio]);
  };

  const updateCardapio = (id: string, cardapio: Partial<Cardapio>) => {
    setCardapios(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...cardapio,
          updatedAt: new Date()
        };
      }
      return item;
    }));
  };

  const deleteCardapio = (id: string) => {
    setCardapios(prev => prev.filter(item => item.id !== id));
  };

  const addEscala = (escala: Omit<Escala, 'id'>) => {
    const novaEscala = { ...escala, id: generateId() };
    setEscalas(prev => [...prev, novaEscala]);
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
        cardapios,
        escalas,
        addPessoa,
        updatePessoa,
        deletePessoa,
        addEvento,
        updateEvento,
        deleteEvento,
        addCardapio,
        updateCardapio,
        deleteCardapio,
        addEscala,
        updateEscala,
        deleteEscala,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
} 