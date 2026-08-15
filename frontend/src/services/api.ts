import type { Cliente, Horario } from "@/types";

export const API_URL = "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = `Erro na requisição (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // resposta sem corpo JSON
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export type ClienteInput = Omit<Cliente, "id">;

export function listarClientes() {
  return request<Cliente[]>("/clientes");
}

export function criarCliente(dados: ClienteInput) {
  return request<Cliente>("/clientes", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarCliente(id: number, dados: ClienteInput) {
  return request<Cliente>(`/clientes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

export function deletarCliente(id: number) {
  return request<void>(`/clientes/${id}`, { method: "DELETE" });
}

export function listarHorarios() {
  return request<Horario[]>("/horarios");
}

export function criarHorario(dados: { date: string; startTime: string; endTime: string }) {
  return request<Horario>("/horarios", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function agendarHorario(id: number, clientId: number) {
  return request<Horario>(`/horarios/${id}/agendar`, {
    method: "PATCH",
    body: JSON.stringify({ clientId }),
  });
}

export function cancelarHorario(id: number) {
  return request<Horario>(`/horarios/${id}/cancelar`, {
    method: "PATCH",
  });
}

export function deletarHorario(id: number) {
  return request<void>(`/horarios/${id}`, { method: "DELETE" });
}