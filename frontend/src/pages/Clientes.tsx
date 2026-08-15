import { useEffect, useMemo, useState } from "react";
import { Pencil, X, Plus, Search, Trash2 } from "lucide-react";
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
import ClienteFormModal from "@/components/ClienteFormModal";
import { formatCpf } from "@/services/masks";
import type { Cliente } from "@/types";
import {
  atualizarCliente,
  criarCliente,
  deletarCliente,
  listarClientes,
} from "@/services/api";

function formatTelefone(telefone: string) {
  const s = telefone.replace(/\D/g, "");
  if (s.length === 11) {
    return `(${s.slice(0, 2)}) ${s.slice(2, 7)}-${s.slice(7)}`;
  }
  if (s.length === 10) {
    return `(${s.slice(0, 2)}) ${s.slice(2, 6)}-${s.slice(6)}`;
  }
  return telefone;
}

function formatData(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const dados = await listarClientes();
        if (!ativo) return;
        setClientes(dados);
        setErro("");
      } catch {
        if (ativo) setErro("Não foi possível carregar os clientes da API.");
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.sobrenome.toLowerCase().includes(termo) ||
        `${c.nome} ${c.sobrenome}`.toLowerCase().includes(termo) ||
        c.cpf.includes(termo)
    );
  }, [busca, clientes]);

  function abrirNovo() {
    setEditando(null);
    setModalOpen(true);
  }

  function abrirEdicao(c: Cliente) {
    setEditando(c);
    setModalOpen(true);
  }

  async function handleSalvar(
    dados: Omit<Cliente, "id">
  ): Promise<string | void> {
    try {
      if (editando) {
        const atualizado = await atualizarCliente(editando.id, dados);
        setClientes((prev) =>
          prev.map((c) => (c.id === atualizado.id ? atualizado : c))
        );
      } else {
        const criado = await criarCliente(dados);
        setClientes((prev) => [...prev, criado]);
      }
    } catch (e) {
      return e instanceof Error ? e.message : "Erro ao salvar cliente.";
    }
  }

  async function handleExcluir(id: number) {
    if (!window.confirm("Excluir este cliente?")) return;
    setExcluindoId(id);
    try {
      await deletarCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir cliente.");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="p-8 md:p-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
            Cadastro
          </p>
          <h1 className="font-sans text-3xl font-semibold text-stone-800">
            Clientes
          </h1>
        </div>
        <Button
          className="gap-1.5 bg-amber-800 text-amber-50 hover:bg-amber-900"
          onClick={abrirNovo}
        >
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      {erro && (
        <div className="mb-4 rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          {erro}
        </div>
      )}

      <div className="mb-3.5 flex items-center justify-between">
        <div className="relative w-full max-w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Buscar por nome ou CPF..."
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

      <Card className="overflow-hiddenr ring-0 border-rounded-xs shadow-sm p-0">
        <CardContent className="p-0">
          {carregando ? (
            <div className="py-16 text-center text-stone-500">Carregando...</div>
          ) : (
            <Table >
              <TableHeader className="bg-stone-200">
                <TableRow className="hover:bg-stone-200">
                  <TableHead className="font-mono text-[11px] uppercase tracking-wide text-stone-500">
                    Nome
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase tracking-wide text-stone-500">
                    Nascimento
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
                    <TableCell className="text-base font-medium text-stone-800">
                      {c.nome} {c.sobrenome}
                    </TableCell>
                    <TableCell className="text-sm text-stone-700">
                      {formatData(c.datanascimento)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-stone-500">
                      {formatCpf(c.cpf)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-stone-500">
                      {formatTelefone(c.telefone)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 border-stone-300"
                          aria-label={`Editar ${c.nome}`}
                          onClick={() => abrirEdicao(c)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 border-stone-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800"
                          aria-label={`Excluir ${c.nome}`}
                          disabled={excluindoId === c.id}
                          onClick={() => handleExcluir(c.id)}
                        >
                          {excluindoId === c.id ? (
                            <Trash2 className="h-3.5 w-3.5 animate-pulse" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
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
          )}
        </CardContent>
      </Card>

      <ClienteFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        cliente={editando}
        onSalvar={handleSalvar}
      />
    </div>
  );
}