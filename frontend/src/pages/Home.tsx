import { useMemo, useState } from "react";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import DayScheduleDialog from "@/components/schedule/DayScheduleDialog";
import { mockClientes, mockHorarios } from "@/data/mockData";
import type { Horario } from "@/types";
import { HOJE, toISO } from "@/lib/horarios";

export default function HomePage() {
  const [horarios, setHorarios] = useState<Horario[]>(mockHorarios);
  const [mes, setMes] = useState(new Date(HOJE.getFullYear(), HOJE.getMonth(), 1));
  const [selecionado, setSelecionado] = useState<Date>(HOJE);
  const [open, setOpen] = useState(false);

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

  function handleDeletarHorario(id: number) {
    setHorarios((prev) => prev.filter((h) => h.id !== id));
  }

  function handleAtribuirCliente(id: number, clientId: number | null) {
    setHorarios((prev) =>
      prev.map((h) => (h.id === id ? { ...h, clientId } : h))
    );
  }

  function handleAdicionarHorario(dados: {
    startTime: string;
    endTime: string;
    clientId: number | null;
  }) {
    const iso = toISO(selecionado);
    const conflita = horarios.some(
      (h) =>
        h.date === iso &&
        dados.startTime < h.endTime &&
        dados.endTime > h.startTime
    );
    if (conflita) return "Já existe um horário cadastrado nesse intervalo.";

    setHorarios((prev) => [...prev, { id: Date.now(), date: iso, ...dados }]);
  }

  return (
    <div className="w-full p-6 md:p-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
          Agenda
        </p>
        <h1 className="font-serif text-3xl font-semibold text-stone-800">
          Calendário
        </h1>
      </div>

      <MonthCalendar
        mes={mes}
        onMesChange={setMes}
        selecionado={selecionado}
        onSelecionarDia={handleSelecionarDia}
        horarios={horarios}
        clientes={mockClientes}
      />

      <DayScheduleDialog
        open={open}
        onOpenChange={setOpen}
        date={selecionado}
        horarios={horariosDoDia}
        clientes={mockClientes}
        onDeletarHorario={handleDeletarHorario}
        onAtribuirCliente={handleAtribuirCliente}
        onAdicionarHorario={handleAdicionarHorario}
      />
    </div>
  );
}