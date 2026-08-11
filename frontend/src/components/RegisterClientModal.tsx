import { useState, type FormEvent } from "react";

const ClientesPage = () => {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cliente = {
      nome,
      sobrenome,
      dataNascimento,
      cpf,
      telefone,
    };

    console.log("Enviando:", cliente);

    try {
      const response = await fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar cliente");
      }

      const data = await response.json();

      console.log("Cliente cadastrado:", data);

      alert("Cliente cadastrado com sucesso!");

      // Limpa os campos depois do cadastro
      setNome("");
      setSobrenome("");
      setDataNascimento("");
      setCpf("");
      setTelefone("");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar cliente.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Cadastro de Cliente
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Sobrenome
          </label>

          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            placeholder="Digite o sobrenome"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Data de nascimento
          </label>

          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            CPF
          </label>

          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Telefone
          </label>

          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default ClientesPage;