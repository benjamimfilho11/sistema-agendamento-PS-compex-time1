import type { Cliente } from "@/types";

export const HOJE = new Date();

export function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function clienteNome(clientes: Cliente[], id: number | null) {
  if (id === null) return null;
  const cliente = clientes.find((c) => c.id === id);
  if (!cliente) return "Cliente removido";
  return `${cliente.nome} ${cliente.sobrenome}`;
}

export function getMonthGrid(mes: Date): Date[] {
  const ano = mes.getFullYear();
  const mesIdx = mes.getMonth();
  const primeiroDia = new Date(ano, mesIdx, 1);
  const offset = primeiroDia.getDay(); // 0 = domingo
  const inicio = new Date(ano, mesIdx, 1 - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    return d;
  });
}