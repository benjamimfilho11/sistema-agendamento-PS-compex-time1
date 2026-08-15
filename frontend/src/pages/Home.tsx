import { useEffect, useMemo, useState } from "react";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import DayScheduleDialog from "@/components/schedule/DayScheduleDialog";
import type { Cliente, Horario } from "@/types";
import { HOJE, toISO } from "@/services/horarios";
import {
  agendarHorario,
  cancelarHorario,
  criarHorario,
  deletarHorario,
  listarClientes,
  listarHorarios,
  trocarClienteHorario,
} from "@/services/api";

export default function HomePage() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mes, setMes] = useState(new Date(HOJE.getFullYear(), HOJE.getMonth(), 1));
  const [selecionado, setSelecionado] = useState<Date>(HOJE);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const [horariosApi, clientesApi] = await Promise.all([
          listarHorarios(),
          listarClientes(),
        ]);
        if (!ativo) return;
        setHorarios(horariosApi);
        setClientes(clientesApi);
        setErro("");
      } catch {
        if (ativo) setErro("Não foi possível carregar os dados da API.");
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const horariosDoDia = useMemo(() => {
    const iso = toISO(selecionado);
    return horarios
      .filter((h) => h.date === iso)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [horarios, selecionado]);

  function handleSelecionarDia(d: Date) {
    setSelecionado(d);
    setOpen(true);
  }

  async function handleDeletarHorario(id: number) {
    try {
      await deletarHorario(id);
      setHorarios((prev) => prev.filter((h) => h.id !== id));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir horário.");
    }
  }

  async function handleAtribuirCliente(id: number, clientId: number | null) {
    try {
      const horario = horarios.find((h) => h.id === id);
      if (!horario) return;
      if (horario.clientId === null && clientId === null) return;

      let atualizado: Horario;
      if (horario.clientId !== null && clientId !== null && clientId !== horario.clientId) {
        atualizado = await trocarClienteHorario(id, clientId);
      } else if (horario.clientId === null && clientId !== null) {
        atualizado = await agendarHorario(id, clientId);
      } else {
        atualizado = await cancelarHorario(id);
      }
      setHorarios((prev) => prev.map((h) => (h.id === id ? atualizado : h)));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao agendar horário.");
    }
  }

  function handleCancelarAgendamento(id: number) {
    return handleAtribuirCliente(id, null);
  }

  async function handleAdicionarHorario(dados: {
    startTime: string;
    endTime: string;
  }): Promise<string | void> {
    try {
      const criado = await criarHorario({
        date: toISO(selecionado),
        ...dados,
      });
      setHorarios((prev) => [...prev, criado]);
    } catch (e) {
      return e instanceof Error ? e.message : "Erro ao cadastrar horário.";
    }
  }

  return (
    <div className="flex h-full w-full flex-col p-4 md:p-6">
      <div className="mb-4 shrink-0">
        <p className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
          Agenda
        </p>
        <h1 className="font-sans text-3xl font-semibold text-stone-800">
          Calendário
        </h1>
      </div>

      {erro && (
        <div className="mb-4 shrink-0 rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="flex flex-1 items-center justify-center text-stone-500">
          Carregando...
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <MonthCalendar
            mes={mes}
            onMesChange={setMes}
            selecionado={selecionado}
            onSelecionarDia={handleSelecionarDia}
            horarios={horarios}
            clientes={clientes}
          />

          <DayScheduleDialog
            open={open}
            onOpenChange={setOpen}
            date={selecionado}
            horarios={horariosDoDia}
            clientes={clientes}
            onDeletarHorario={handleDeletarHorario}
            onAtribuirCliente={handleAtribuirCliente}
            onAdicionarHorario={handleAdicionarHorario}
            onCancelarAgendamento={handleCancelarAgendamento}
          />
        </div>
      )}
    </div>
  );
}