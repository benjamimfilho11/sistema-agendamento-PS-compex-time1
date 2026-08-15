import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NovoHorarioFormProps {
  onCancelar: () => void;
  onSalvar: (dados: { startTime: string; endTime: string }) =>
    | string
    | void
    | Promise<string | void>;
}

export default function NovoHorarioForm({
  onCancelar,
  onSalvar,
}: NovoHorarioFormProps) {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [erro, setErro] = useState("");

  async function handleSalvar() {
    if (!inicio || !fim) {
      setErro("Preencha o início e o fim do horário.");
      return;
    }
    if (fim <= inicio) {
      setErro("O horário de fim precisa ser depois do início.");
      return;
    }
    const resultado = await onSalvar({
      startTime: inicio,
      endTime: fim,
    });
    if (resultado) {
      setErro(resultado);
      return;
    }
    setInicio("");
    setFim("");
    setErro("");
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-stone-200 bg-stone-100/60 p-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="novo-inicio" className="text-xs text-stone-600">
            Início
          </Label>
          <Input
            id="novo-inicio"
            type="time"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="border-stone-300 bg-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="novo-fim" className="text-xs text-stone-600">
            Fim
          </Label>
          <Input
            id="novo-fim"
            type="time"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className="border-stone-300 bg-white"
          />
        </div>
      </div>

      {erro && <p className="text-xs font-medium text-orange-700">{erro}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" className="text-stone-600" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button
          className="bg-amber-800 text-amber-50 hover:bg-amber-900"
          onClick={handleSalvar}
        >
          Salvar horário
        </Button>
      </div>
    </div>
  );
}
