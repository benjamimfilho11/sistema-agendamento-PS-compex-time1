# Sistema de Agendamento — PS Compex Time 1
Benjamim Pessoa Vale Filho.  

Arthur Santos Santiago Ribeiro.  

José Bernardo Alves Fortes.  

Repositório de código do Sistema de Agendamento desenvolvido durante o Processo Seletivo da Compex Júnior.

## Sobre o projeto

O Sistema de Agendamento é uma aplicação web desenvolvida para auxiliar no gerenciamento de clientes, horários e agendamentos.

A aplicação permite cadastrar e consultar clientes, criar horários disponíveis, realizar agendamentos, cancelar agendamentos e gerenciar os clientes associados aos horários.

O projeto é dividido em frontend e backend, com comunicação realizada através de uma API REST.

## Funcionalidades

- Cadastro de clientes;
- Listagem de clientes;
- Atualização de clientes;
- Exclusão de clientes;
- Cadastro de horários;
- Listagem de horários;
- Exclusão de horários livres;
- Agendamento de clientes;
- Cancelamento de agendamentos;
- Troca de cliente associado a um horário;
- Consulta dos próximos agendamentos;
- Validação de conflitos de horários;
- Validação de datas e horários;
- Validação de clientes existentes;
- Validação de CPF duplicado.

## Tecnologias utilizadas

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend

- Python
- FastAPI
- Pydantic
- SQLite
- Uvicorn

### Ferramentas

- Git
- GitHub
- Visual Studio Code

## Arquitetura

A aplicação é organizada em frontend, backend e banco de dados.

```text
Frontend — React
       │
       │ HTTP / JSON
       ▼
Backend — FastAPI
       │
       ▼
Repositories
       │
       ▼
Banco de dados — SQLite
```

O frontend é responsável pela interface e pela interação com o usuário. O backend disponibiliza a API, aplica as regras de negócio e realiza a comunicação com o banco de dados.

## Estrutura do backend

```text
backend/
├── app/
│   ├── database/
│   │   ├── connection.py
│   │   └── init_db.py
│   │
│   ├── repositories/
│   │   ├── cliente_repositorio.py
│   │   └── horario_repository.py
│   │
│   ├── routers/
│   │   ├── clientes.py
│   │   └── horarios.py
│   │
│   ├── schemas/
│   │   ├── cliente.py
│   │   └── horario.py
│   │
│   └── main.py
│
├── tests/
├── database.db
└── requirements.txt
```

### Principais responsabilidades

**`routers/`**

Contém os endpoints da API e as regras de validação das requisições.

**`schemas/`**

Define os modelos utilizados para entrada e saída de dados da API.

**`repositories/`**

Responsável pelas operações de persistência e consulta no banco de dados.

**`database/`**

Responsável pela conexão e inicialização do banco SQLite.

## API

A API REST foi desenvolvida utilizando FastAPI.

### Clientes

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/clientes` | Cadastra um cliente |
| `GET` | `/api/clientes` | Lista os clientes cadastrados |
| `PATCH` | `/api/clientes/{cliente_id}` | Atualiza os dados de um cliente |
| `DELETE` | `/api/clientes/{cliente_id}` | Exclui um cliente |

### Horários e agendamentos

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/horarios` | Cadastra um horário |
| `GET` | `/api/horarios` | Lista os horários |
| `GET` | `/api/horarios/proximos` | Lista os próximos agendamentos |
| `DELETE` | `/api/horarios/{horario_id}` | Exclui um horário livre |
| `PATCH` | `/api/horarios/{horario_id}/agendar` | Agenda um cliente |
| `PATCH` | `/api/horarios/{horario_id}/cancelar` | Cancela um agendamento |
| `PATCH` | `/api/horarios/{horario_id}/cliente` | Altera o cliente associado ao horário |

## Regras de negócio

### Horários

Ao cadastrar um horário, o sistema verifica:

- O horário final deve ser posterior ao horário inicial;
- A data do horário não pode estar no passado;
- Não pode existir conflito com outro horário cadastrado.

### Conflito de horários

O sistema impede o cadastro de horários que conflitem com um horário já existente.

Dessa forma, um mesmo período não pode ser ocupado por dois horários diferentes.

### Agendamento

Para realizar um agendamento:

- O horário deve existir;
- A data do horário não pode estar no passado;
- O horário deve estar livre;
- O cliente informado deve existir.

### Cancelamento

O cancelamento é realizado através do endpoint:

```text
PATCH /api/horarios/{horario_id}/cancelar
```

O sistema verifica se o horário existe e se está ocupado.

Ao cancelar, o horário não é excluído. O vínculo com o cliente é removido e o horário volta a ficar disponível para novos agendamentos.

### Clientes

O sistema impede o cadastro de clientes com CPF duplicado.

Também são realizadas validações para operações envolvendo clientes inexistentes.

## Códigos HTTP

A API utiliza códigos HTTP para representar o resultado das operações.

Alguns exemplos:

| Código | Significado | Exemplo |
|---|---|---|
| `201` | Created | Cliente ou horário cadastrado |
| `400` | Bad Request | Data ou horário inválido |
| `404` | Not Found | Cliente ou horário inexistente |
| `409` | Conflict | CPF duplicado ou conflito de horário |
| `204` | No Content | Exclusão realizada com sucesso |

## Banco de dados

O projeto utiliza SQLite para persistência dos dados.

O banco é armazenado no arquivo:

```text
database.db
```

A configuração e inicialização do banco estão localizadas em:

```text
app/database/
```

## Como executar o projeto

### Backend

Entre na pasta do backend:

```bash
cd backend
```

Crie um ambiente virtual:

```bash
python -m venv .venv
```

Ative o ambiente virtual no Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute o servidor:

```bash
uvicorn app.main:app --reload
```

### Frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O endereço do frontend será informado pelo Vite no terminal.

## Documentação da API

Por utilizar FastAPI, o backend disponibiliza documentação interativa dos endpoints através do Swagger UI.

Após iniciar o servidor, a documentação pode ser acessada pelo endereço padrão do FastAPI:

```text
/docs
```

## Comunicação entre frontend e backend

O frontend React realiza requisições HTTP para os endpoints disponibilizados pelo FastAPI.

Os dados são enviados e recebidos em formato JSON.

```text
Usuário
   │
   ▼
Interface React
   │
   │ HTTP + JSON
   ▼
API REST — FastAPI
   │
   ├── Clientes
   │
   └── Horários / Agendamentos
   │
   ▼
Repositories
   │
   ▼
SQLite
```

A URL base da API é centralizada na configuração do frontend, facilitando a manutenção e evitando a repetição do endereço do backend nos diferentes serviços da aplicação.

## Controle de versão

O projeto utiliza Git e GitHub para controle de versão.

As funcionalidades são desenvolvidas em branches específicas e posteriormente integradas à branch de desenvolvimento por meio de Pull Requests.

## Equipe

**Time 1 — Processo Seletivo Compex Júnior**

Projeto desenvolvido colaborativamente pelos integrantes do Time 1.

## Status

Projeto desenvolvido durante o Processo Seletivo da Compex Júnior.

---

Desenvolvido pelo **Time 1 — Processo Seletivo Compex Júnior**.
