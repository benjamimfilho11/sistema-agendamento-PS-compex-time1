import { useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskCpf, maskTelefone, unmask } from "@/services/masks";
import type { Cliente } from "@/types";

interface ClienteFormModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cliente: Cliente | null;
  onSalvar: (dados: Omit<Cliente, "id">) => Promise<string | void>;
}

const VAZIO = {
  nome: "",
  sobrenome: "",
  datanascimento: "",
  cpf: "",
  telefone: "",
};

function formInicial(cliente: Cliente | null) {
  if (!cliente) return { ...VAZIO };
  return {
    nome: cliente.nome,
    sobrenome: cliente.sobrenome,
    datanascimento: cliente.datanascimento,
    cpf: maskCpf(cliente.cpf),
    telefone: maskTelefone(cliente.telefone),
  };
}

export default function ClienteFormModal({
  open,
  onOpenChange,
  cliente,
  onSalvar,
}: ClienteFormModalProps) {
  const [form, setForm] = useState(() => formInicial(cliente));
  const [prevEstado, setPrevEstado] = useState({ open, cliente });
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  if (open !== prevEstado.open || cliente !== prevEstado.cliente) {
    setPrevEstado({ open, cliente });
    if (open) {
      setForm(formInicial(cliente));
      setErro("");
    }
  }

  function setCampo(campo: keyof typeof VAZIO, valor: string) {
    const valorFiltrado =
      campo === "cpf"
        ? maskCpf(valor)
        : campo === "telefone"
          ? maskTelefone(valor)
          : valor;
    setForm((prev) => ({ ...prev, [campo]: valorFiltrado }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.sobrenome.trim()) {
      setErro("Preencha nome e sobrenome.");
      return;
    }
    if (unmask(form.cpf).length !== 11) {
      setErro("CPF incompleto — informe os 11 dígitos.");
      return;
    }
    const digitosTelefone = unmask(form.telefone);
    if (digitosTelefone.length !== 10 && digitosTelefone.length !== 11) {
      setErro("Telefone incompleto — informe 10 ou 11 dígitos.");
      return;
    }
    setSalvando(true);
    const resultado = await onSalvar({
      ...form,
      cpf: unmask(form.cpf),
      telefone: unmask(form.telefone),
    });
    setSalvando(false);
    if (resultado) {
      setErro(resultado);
      return;
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-stone-50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans text-stone-800">
            {cliente ? "Editar cliente" : "Novo cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cli-nome" className="text-xs text-stone-600">
                Nome
              </Label>
              <Input
                id="cli-nome"
                value={form.nome}
                onChange={(e) => setCampo("nome", e.target.value)}
                className="border-stone-300 bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cli-sobrenome" className="text-xs text-stone-600">
                Sobrenome
              </Label>
              <Input
                id="cli-sobrenome"
                value={form.sobrenome}
                onChange={(e) => setCampo("sobrenome", e.target.value)}
                className="border-stone-300 bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cli-nascimento" className="text-xs text-stone-600">
              Data de nascimento
            </Label>
            <Input
              id="cli-nascimento"
              type="date"
              value={form.datanascimento}
              onChange={(e) => setCampo("datanascimento", e.target.value)}
              className="border-stone-300 bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cli-cpf" className="text-xs text-stone-600">
              CPF
            </Label>
            <Input
              id="cli-cpf"
              value={form.cpf}
              maxLength={14}
              onChange={(e) => setCampo("cpf", e.target.value)}
              placeholder="000.000.000-00"
              className="border-stone-300 bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cli-telefone" className="text-xs text-stone-600">
              Telefone
            </Label>
            <Input
              id="cli-telefone"
              value={form.telefone}
              maxLength={15}
              onChange={(e) => setCampo("telefone", e.target.value)}
              placeholder="(00) 00000-0000"
              className="border-stone-300 bg-white"
            />
          </div>

          {erro && <p className="text-xs font-medium text-orange-700">{erro}</p>}

          <DialogFooter className="border-0 bg-stone-100">
            <Button
              type="button"
              variant="outline"
              className="border-stone-300 text-stone-700"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={salvando}
              className="bg-amber-800 text-amber-50 hover:bg-amber-900"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}