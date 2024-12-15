import Dexie, { Table } from 'dexie';
import { Pessoa, Evento, Escala, Notificacao, Usuario } from '../types';

export class StraturaDB extends Dexie {
  pessoas!: Table<Pessoa>;
  eventos!: Table<Evento>;
  escalas!: Table<Escala>;
  notificacoes!: Table<Notificacao>;
  usuarios!: Table<Usuario>;

  constructor() {
    super('StraturaDB');
    
    this.version(1).stores({
      pessoas: '++id, nome, email, telefone, funcaoPrincipal, createdAt, updatedAt',
      eventos: '++id, nome, data, local, tipo, status, createdAt, updatedAt',
      escalas: '++id, eventoId, status, createdAt, updatedAt',
      notificacoes: '++id, tipo, lida, data, createdAt',
      usuarios: '++id, email, role, createdAt, updatedAt'
    });

    // Configurar hooks para garantir que as datas sejam sempre Date
    this.pessoas.hook('reading', obj => {
      if (obj.createdAt) obj.createdAt = new Date(obj.createdAt);
      if (obj.updatedAt) obj.updatedAt = new Date(obj.updatedAt);
      return obj;
    });

    this.eventos.hook('reading', obj => {
      if (obj.createdAt) obj.createdAt = new Date(obj.createdAt);
      if (obj.updatedAt) obj.updatedAt = new Date(obj.updatedAt);
      return obj;
    });

    this.escalas.hook('reading', obj => {
      if (obj.createdAt) obj.createdAt = new Date(obj.createdAt);
      if (obj.updatedAt) obj.updatedAt = new Date(obj.updatedAt);
      return obj;
    });
  }
}

export const db = new StraturaDB();

// Funções auxiliares para manipulação do banco
export const dbHelpers = {
  // Pessoas
  async addPessoa(pessoa: Omit<Pessoa, 'id'>) {
    const now = new Date();
    const pessoaCompleta = {
      ...pessoa,
      createdAt: now,
      updatedAt: now
    };
    const id = await db.pessoas.add(pessoaCompleta);
    return id;
  },
  
  async getPessoas() {
    return await db.pessoas.toArray();
  },
  
  async updatePessoa(id: number, pessoa: Partial<Pessoa>) {
    const update = {
      ...pessoa,
      updatedAt: new Date()
    };
    await db.pessoas.update(id, update);
    return id;
  },
  
  async deletePessoa(id: number) {
    await db.pessoas.delete(id);
    return id;
  },

  // Eventos
  async addEvento(evento: Omit<Evento, 'id'>) {
    const now = new Date();
    const eventoCompleto = {
      ...evento,
      createdAt: now,
      updatedAt: now,
      status: evento.status || 'pendente',
      progresso: evento.progresso || {
        escalaCompleta: false,
        equipePronta: false,
        materiaisPreparados: false,
        checklistConcluido: false,
        emAndamento: false,
        finalizado: false
      }
    };
    const id = await db.eventos.add(eventoCompleto);
    return id;
  },
  
  async getEventos() {
    return await db.eventos.toArray();
  },
  
  async updateEvento(id: number, evento: Partial<Evento>) {
    const update = {
      ...evento,
      updatedAt: new Date()
    };
    await db.eventos.update(id, update);
    return id;
  },
  
  async deleteEvento(id: number) {
    await db.eventos.delete(id);
    return id;
  },

  // Escalas
  async addEscala(escala: Omit<Escala, 'id'>) {
    const now = new Date();
    const escalaCompleta = {
      ...escala,
      createdAt: now,
      updatedAt: now,
      status: escala.status || 'rascunho'
    };
    const id = await db.escalas.add(escalaCompleta);
    return id;
  },
  
  async getEscalas() {
    return await db.escalas.toArray();
  },
  
  async updateEscala(id: number, escala: Partial<Escala>) {
    const update = {
      ...escala,
      updatedAt: new Date()
    };
    await db.escalas.update(id, update);
    return id;
  },
  
  async deleteEscala(id: number) {
    await db.escalas.delete(id);
    return id;
  },

  // Notificações
  async addNotificacao(notificacao: Omit<Notificacao, 'id'>) {
    const id = await db.notificacoes.add(notificacao);
    return id;
  },
  
  async getNotificacoes() {
    return await db.notificacoes.toArray();
  },
  
  async updateNotificacao(id: number, notificacao: Partial<Notificacao>) {
    await db.notificacoes.update(id, notificacao);
    return id;
  },
  
  async deleteNotificacao(id: number) {
    await db.notificacoes.delete(id);
    return id;
  }
}; 