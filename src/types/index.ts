export interface Pessoa {
  id: number;
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

export interface PessoaEscalada {
  id: number;
  nome: string;
  funcao: string;
  confirmado: boolean;
}

export interface Evento {
  id: number;
  nome: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  tipo: string;
  quantidadePessoas: number;
  caracteristicas: {
    cardapio: {
      nome: string;
      itens: ItemCardapio[];
    };
    temBebidas: boolean;
    tipoBebidas: ('cerveja' | 'chopp' | 'drinks' | 'refrigerante' | 'agua')[];
    temCabineFoto: boolean;
    tipoCabineFoto: 'propria' | 'externa' | undefined;
    outrasCaracteristicas: string[];
  };
  observacoes?: string;
  status: 'pendente' | 'em_andamento' | 'finalizado' | 'cancelado';
  progresso: {
    escalaCompleta: boolean;
    equipePronta: boolean;
    materiaisPreparados: boolean;
    checklistConcluido: boolean;
    emAndamento: boolean;
    finalizado: boolean;
  };
  pessoasEscaladas?: PessoaEscalada[];
  escala?: Escala;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemCardapio {
  nome: string;
  categoria: string;
  quantidade: number;
}

export interface Escala {
  id: number;
  eventoId: number;
  pessoas: {
    pessoaId: number;
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
  id: number;
  tipo: NotificacaoTipo;
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  dadosAdicionais?: {
    eventoId?: number;
    escalaId?: number;
  };
}

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
} 