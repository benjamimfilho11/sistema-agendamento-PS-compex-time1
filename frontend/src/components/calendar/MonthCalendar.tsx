import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DayCell from "./DayCell.tsx";
import { HOJE, getMonthGrid, toISO } from "@/lib/horarios";
import type { Cliente, Horario } from "@/types";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface MonthCalendarProps {
  mes: Date;
  onMesChange: (d: Date) => void;
  selecionado: Date;
  onSelecionarDia: (d: Date) => void;
  horarios: Horario[];
  clientes: Cliente[];
}

export default function MonthCalendar({
  mes,
  onMesChange,
  selecionado,
  onSelecionarDia,
  horarios,
  clientes,
}: MonthCalendarProps) {
  const dias = useMemo(() => getMonthGrid(mes), [mes]);

  const horariosPorDia = useMemo(() => {
    const map = new Map<string, Horario[]>();
    for (const h of horarios) {
      const arr = map.get(h.date) ?? [];
      arr.push(h);
      map.set(h.date, arr);
    }
    for (const arr of map.values())
      arr.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return map;
  }, [horarios]);

  function mudarMes(delta: number) {
    onMesChange(new Date(mes.getFullYear(), mes.getMonth() + delta, 1));
  }

  const label = mes.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const hojeISO = toISO(HOJE);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-stone-300 bg-stone-50 shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
        <h2 className="font-serif text-xl font-semibold capitalize text-stone-800">
          {label}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-stone-300"
            onClick={() => mudarMes(-1)}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-stone-300 text-xs text-stone-700"
            onClick={() =>
              onMesChange(new Date(HOJE.getFullYear(), HOJE.getMonth(), 1))
            }
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-stone-300"
            onClick={() => mudarMes(1)}
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-100">
        {DIAS_SEMANA.map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-center font-mono text-[11px] uppercase tracking-wide text-stone-500"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {dias.map((d) => {
          const iso = toISO(d);
          return (
            <DayCell
              key={iso}
              date={d}
              isCurrentMonth={d.getMonth() === mes.getMonth()}
              isToday={iso === hojeISO}
              isSelected={iso === toISO(selecionado)}
              horarios={horariosPorDia.get(iso) ?? []}
              clientes={clientes}
              onClick={() => onSelecionarDia(d)}
            />
          );
        })}
      </div>
    </div>
  );
}
