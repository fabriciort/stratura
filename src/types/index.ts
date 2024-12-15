export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Pessoa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  funcaoPrincipal: string;
  funcoesSecundarias: string[];
  disponibilidade: {
    dias: ('segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo')[];
    periodos: ('manha' | 'tarde' | 'noite')[];
  };
  observacoes?: string;
}

export interface Evento {
  id: string;
  nome: string;
  data: Date;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  tipo: string;
  cardapioId: string;
  quantidadePessoas: number;
  observacoes?: string;
  escala?: Escala;
}

export interface ItemCardapio {
  nome: string;
  categoria: string;
  quantidade: number;
}

export interface Cardapio {
  id: string;
  nome: string;
  itens: ItemCardapio[];
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Escala {
  id: string;
  eventoId: string;
  pessoas: {
    pessoaId: string;
    funcao: string;
  }[];
  status: 'rascunho' | 'confirmada' | 'finalizada';
  observacoes?: string;
}

export type NotificacaoTipo = 
  | 'evento_novo'
  | 'evento_atualizado'
  | 'escala_nova'
  | 'escala_atualizada'
  | 'escala_confirmacao'
  | 'cardapio_novo'
  | 'cardapio_atualizado'
  | 'lembrete_evento';

export interface Notificacao {
  id: string;
  tipo: NotificacaoTipo;
  titulo: string;
  mensagem: string;
  lida: boolean;
  data: Date;
  link?: string;
  dadosAdicionais?: {
    eventoId?: string;
    escalaId?: string;
    cardapioId?: string;
    pessoaId?: string;
  };
}

export interface Mensagem {
  id: string;
  remetente: {
    id: string;
    nome: string;
  };
  conteudo: string;
  data: Date;
  lida: boolean;
  tipo: 'texto' | 'imagem' | 'arquivo';
  eventoId?: string;
  escalaId?: string;
  cardapioId?: string;
}

export interface Chat {
  id: string;
  tipo: 'privado' | 'grupo' | 'evento';
  nome?: string;
  participantes: {
    id: string;
    nome: string;
    ultimaVisualizacao?: Date;
  }[];
  mensagens: Mensagem[];
  eventoId?: string;
  escalaId?: string;
} 