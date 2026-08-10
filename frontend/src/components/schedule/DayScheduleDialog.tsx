import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HorarioListItem from "./HorarioListItem";
import NovoHorarioForm from "./NovoHorarioForm";
import type { Cliente, Horario } from "@/types";

interface DayScheduleDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  date: Date;
  horarios: Horario[];
  clientes: Cliente[];
  onDeletarHorario: (id: number) => void;
  onAtribuirCliente: (id: number, clientId: number | null) => void;
  onAdicionarHorario: (dados: {
    startTime: string;
    endTime: string;
    clientId: number | null;
  }) => string | void;
}

export default function DayScheduleDialog({
  open,
  onOpenChange,
  date,
  horarios,
  clientes,
  onDeletarHorario,
  onAtribuirCliente,
  onAdicionarHorario,
}: DayScheduleDialogProps) {
  const [mostrarForm, setMostrarForm] = useState(false);

  const dataLabel = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setMostrarForm(false);
      }}
    >
      <DialogContent className="border-stone-300 bg-stone-50 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif capitalize text-stone-800">
            {dataLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
          {horarios.length === 0 && (
            <div className="rounded-md border border-dashed border-stone-300 py-8 text-center text-sm text-stone-500">
              Nenhum horário cadastrado neste dia
            </div>
          )}
          {horarios.map((h) => (
            <HorarioListItem
              key={h.id}
              horario={h}
              clientes={clientes}
              onAtribuirCliente={(clientId) => onAtribuirCliente(h.id, clientId)}
              onDeletar={() => onDeletarHorario(h.id)}
            />
          ))}
        </div>

        {mostrarForm ? (
          <NovoHorarioForm
            clientes={clientes}
            onCancelar={() => setMostrarForm(false)}
            onSalvar={(dados) => {
              const erro = onAdicionarHorario(dados);
              if (!erro) setMostrarForm(false);
              return erro;
            }}
          />
        ) : (
          <Button
            variant="outline"
            className="w-full gap-1.5 border-dashed border-stone-300 text-stone-600 hover:bg-stone-100"
            onClick={() => setMostrarForm(true)}
          >
            <Plus className="h-4 w-4" />
            Cadastrar novo horário
          </Button>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            className="border-stone-300 text-stone-700"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}