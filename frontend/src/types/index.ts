export interface Cliente {
  id: number;
  nome: string;
  sobrenome: string;
  datanascimento: string; // YYYY-MM-DD
  cpf: string;
  telefone: string;
}

export interface Horario {
  id: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  clientId: number | null; // null = horário livre
}