import { clienteNome } from "@/services/horarios";
import type { Cliente, Horario } from "@/types";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  horarios: Horario[];
  clientes: Cliente[];
  onClick: () => void;
}

export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  horarios,
  clientes,
  onClick,
}: DayCellProps) {
  const visiveis = horarios.slice(0, 2);
  const resto = horarios.length - visiveis.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-0 flex-col items-start gap-1.5 overflow-hidden border-b border-r border-stone-200 p-2 text-left transition-colors hover:bg-amber-50",
        ${!isCurrentMonth && "bg-stone-100/70"},
        ${isSelected && "bg-amber-100 hover:bg-amber-100}"}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium
         ${
           isToday
             ? "bg-amber-800 text-amber-50"
             : isCurrentMonth
               ? "text-stone-700"
               : "text-stone-400"
         }`}
      >
        {date.getDate()}
      </span>

      <div className="flex w-full flex-col gap-1">
        {visiveis.map((h) => {
          const ocupado = h.clientId !== null;
          const nome = ocupado ? clienteNome(clientes, h.clientId) : "Livre";
          return (
            <span
              key={h.id}
              className={`rounded px-1.5 py-0.5 text-[11px] font-medium",
                ${
                  ocupado
                    ? "bg-orange-50 text-orange-700"
                    : "bg-green-50 text-green-700"
                }`}
            >
              {h.startTime} {nome}
            </span>
          );
        })}
        {resto > 0 && (
          <span className="text-[11px] font-medium text-stone-500">
            +{resto} mais
          </span>
        )}
      </div>
    </button>
  );
}
