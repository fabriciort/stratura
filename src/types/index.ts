export interface Pessoa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  funcaoPrincipal: string;
  funcaoSecundaria?: string;
  disponibilidade: {
    dias: string[];
    periodos: string[];
  };
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Evento {
  id: string;
  nome: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  tipo: string;
  quantidadePessoas: number;
  caracteristicas: {
    bebidas: boolean;
    fotografia: boolean;
    cardapio: {
      nome: string;
      itens: ItemCardapio[];
    };
  };
  observacoes?: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemCardapio {
  nome: string;
  categoria: string;
  quantidade: number;
}

export interface Escala {
  id: string;
  eventoId: string;
  pessoas: {
    pessoaId: string;
    funcao: string;
    confirmado: boolean;
  }[];
  status: 'rascunho' | 'finalizada';
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificacaoTipo =
  | 'evento_novo'
  | 'evento_atualizado'
  | 'escala_nova'
  | 'escala_atualizada'
  | 'escala_confirmacao'
  | 'lembrete_evento';

export interface Notificacao {
  id: string;
  tipo: NotificacaoTipo;
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  dadosAdicionais?: {
    eventoId?: string;
    escalaId?: string;
  };
}

export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
} 