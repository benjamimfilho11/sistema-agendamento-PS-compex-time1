export interface Cliente {
  id: number;
  name: string;
  email: string;
  cpf: string;
  telefone: number;
}

export interface Horario {
  id: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  clientId: number | null; // null = horário livre
}