import { Trash2, X} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Cliente, Horario } from "@/types";

interface HorarioListItemProps {
  horario: Horario;
  clientes: Cliente[];
  onAtribuirCliente: (clientId: number | null) => void;
  onCancelar: () => void;
  onDeletar: () => void;
}

export default function HorarioListItem({
  horario,
  clientes,
  onAtribuirCliente,
  onCancelar,
  onDeletar,
}: HorarioListItemProps) {
  const ocupado = horario.clientId !== null;

  return (
    <div className="flex items-center gap-2.5 rounded-md border border-stone-200 bg-white px-3 py-2.5">
      <span className="w-24 shrink-0 font-mono text-sm font-medium text-stone-800">
        {horario.startTime}–{horario.endTime}
      </span>

      <Select
        value={horario.clientId !== null ? String(horario.clientId) : "livre"}
        onValueChange={(v) =>
          onAtribuirCliente(v === "livre" ? null : Number(v))
        }
      >
        <SelectTrigger className="h-8 flex-1 border-stone-300 bg-stone-50 text-xs">
          <SelectValue placeholder="Cliente">
            {horario.clientId !== null
              ? (() => {
                  const cliente = clientes.find(
                    (c) => c.id === horario.clientId
                  );
                  return cliente
                    ? `${cliente.nome} ${cliente.sobrenome}`
                    : "Cliente removido";
                })()
              : "livre"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-stone-50">
          <SelectItem value="livre" className="bg-stone-50 text-stone-400">
            Sem cliente (livre)
          </SelectItem>
          {clientes.map((c) => (
            <SelectItem key={c.id} value={String(c.id)} className="bg-stone-50">
              {c.nome} {c.sobrenome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Badge
        variant="outline"
        className={
          ocupado
            ? "shrink-0 border-orange-300 text-orange-700"
            : "shrink-0 border-green-300 text-green-700"
        }
      >
        {ocupado ? "Agendado" : "Livre"}
      </Badge>
    {ocupado && (
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 shrink-0 border-stone-300 text-stone-500 hover:border-red-300 hover:bg-orange-50 hover:text-red-700"
        aria-label="Cancelar horário"
        onClick={onCancelar}
        >
          <X className="mr-1 h-3.5 w-3.5" />
        </Button>
    )}
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 shrink-0 border-stone-300 text-stone-500 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
        aria-label="Excluir horário"
        onClick={onDeletar}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
