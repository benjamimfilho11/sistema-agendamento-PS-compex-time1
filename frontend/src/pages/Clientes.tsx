import { useMemo, useState } from "react";
import { Pencil, X, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { mockClientes } from "@/data/mockData";

function formatTelefone(telefone: number) {
  const s = String(telefone);
  if (s.length === 11) {
    return `(${s.slice(0, 2)}) ${s.slice(2, 7)}-${s.slice(7)}`;
  }
  return s;
}

export default function ClientesPage() {
  const [busca, setBusca] = useState("");

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return mockClientes;
    return mockClientes.filter(
      (c) =>
        c.name.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.cpf.includes(termo),
    );
  }, [busca]);

  return (
    <div className="p-8 md:p-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
            Cadastro
          </p>
          <h1 className="font-serif text-3xl font-semibold text-stone-800">
            Clientes
          </h1>
        </div>
        <Button className="gap-1.5 bg-amber-800 text-amber-50 hover:bg-amber-900">
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      <div className="mb-3.5 flex items-center justify-between">
        <div className="relative w-full max-w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border-stone-300 bg-stone-50 pl-9"
          />
        </div>
        <span className="font-mono text-xs text-stone-500">
          {clientesFiltrados.length}{" "}
          {clientesFiltrados.length === 1 ? "cliente" : "clientes"}
        </span>
      </div>

      <Card className="overflow-hidden border-stone-300 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-stone-200">
              <TableRow className="hover:bg-stone-200">
                <TableHead className="font-mono text-[11px] uppercase tracking-wide text-stone-500">
                  Nome
                </TableHead>
                <TableHead className="font-mono text-[11px] uppercase tracking-wide text-stone-500">
                  E-mail
                </TableHead>
                <TableHead className="font-mono text-[11px] uppercase tracking-wide text-stone-500">
                  CPF
                </TableHead>
                <TableHead className="font-mono text-[11px] uppercase tracking-wide text-stone-500">
                  Telefone
                </TableHead>
                <TableHead className="w-22" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((c) => (
                <TableRow
                  key={c.id}
                  className="bg-stone-50 hover:bg-green-50/60"
                >
                  <TableCell className="font-medium text-stone-800">
                    {c.name}
                  </TableCell>
                  <TableCell className="text-stone-700">{c.email}</TableCell>
                  <TableCell className="font-mono text-xs text-stone-500">
                    {c.cpf}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-stone-500">
                    {formatTelefone(c.telefone)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 border-stone-300"
                        aria-label={`Editar ${c.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 border-stone-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800"
                        aria-label={`Excluir ${c.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {clientesFiltrados.length === 0 && (
                <TableRow className="bg-stone-50">
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-stone-500"
                  >
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
