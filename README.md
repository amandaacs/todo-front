# To-Do List Frontend

Frontend da aplicação To-Do List, desenvolvida em **ReactJS** com **Material UI**. Esta interface permite que usuários se registrem, façam login, gerenciem suas tarefas e utilizem a aplicação com uma experiência amigável.

A aplicação se comunica com uma API backend feita em Spring Boot que gerencia autenticação e persistência de dados.

## Tecnologias Utilizadas

- ReactJS
- React Router DOM
- Material UI
- JavaScript (ES6+)
- Context API
- Fetch API
- HTML5 + CSS3

## Funcionalidades

- Registro de novos usuários
- Login com autenticação via JWT
- Logout
- Listagem de tarefas do usuário logado
- Criação de nova tarefa
- Edição de tarefa
- Marcar e desmarcar como concluída
- Remoção de tarefa

## Como Executar o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/amandaacs/todo-front.git
cd todo-frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o projeto:

```bash
npm start
```

O projeto será executado em `http://localhost:3000`.

> ⚠️ Certifique-se de que o backend esteja rodando em `http://localhost:8080`.

## Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis como TaskCard etc.
├── pages/            # Páginas da aplicação: Login, Register, Tasks
├── context/          # Contexto de autenticação do usuário
├── services/         # Requisições HTTP usando Fetch API
├── App.js            # Definição de rotas
└── index.js          # Ponto de entrada da aplicação
```

## Rotas da Aplicação

| Caminho        | Componente   | Acesso     |
|----------------|--------------|------------|
| `/tasks`       | TaskList     | Privado    |
| `/`            | Login        | Público    |
| `/register`    | Register     | Público    |

## Variáveis de Ambiente

Você pode definir a URL base da API criando um arquivo `.env` na raiz:

```env
API_URL=http://localhost:8080/api
```

## Requisições Exemplo

Todas as requisições são feitas com `fetch` usando o token JWT no header.

**Criar tarefa:**

```js
fetch(`${API_URL}/tasks`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    title: "Estudar Spring",
    description: "Revisar conceitos de API REST"
  })
});
```

**Logout:**

O token é removido do `localStorage` e o usuário é redirecionado para `/login`.

## Telas

(Imagens opcionais de telas da aplicação aqui)

## Licença

Este projeto foi desenvolvido como parte de um portfólio pessoal. Fique à vontade para estudar, adaptar ou utilizar como referência.
