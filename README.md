# 🛒 Vitrine Caldas Novas

Plataforma desenvolvida como **Produto Mínimo Viável (MVP)** para a Atividade Extensionista do curso de Análise e Desenvolvimento de Sistemas (UNINTER).

O projeto visa solucionar a barreira da inclusão digital para pequenos feirantes e artesãos (com foco inicial na "Feira Rua da Feira" em Caldas Novas - GO). O sistema atua como uma vitrine virtual de baixo atrito, conectando clientes diretamente ao WhatsApp do comerciante, sem a necessidade de cadastros complexos ou taxas de e-commerce.

## 🎯 Objetivos de Desenvolvimento Sustentável (ODS)

- **08:** Trabalho Decente e Crescimento Econômico
- **09:** Indústria, Inovação e Infraestrutura
- **10:** Redução das Desigualdades

## 🚀 Tecnologias Utilizadas (Fullstack)

Este projeto foi construído em arquitetura Monorepo, utilizando as seguintes tecnologias:

### Backend

- **Node.js** com **Express**
- **TypeScript** (Tipagem Forte)
- **Mongoose / MongoDB Atlas** (Banco de Dados NoSQL)
- Padrão **SOLID** e Arquitetura em Camadas (Routes, Controllers, Services, Models)

### Frontend

- **Angular 18+** (Novo Control Flow `@if`, `@for` e Standalone Components)
- **Tailwind CSS** e **SCSS**
- Design Responsivo (Mobile First)
- Foco em Usabilidade e Acessibilidade (Desenho Universal, WAI-ARIA)

## 📂 Estrutura do Repositório (Monorepo)

```text
/vitrine-caldas-novas
├── /backend     # API RESTful (Node.js)
└── /frontend    # Aplicação Web (Angular)
```

🛠️ Como rodar o projeto localmente

1. Clonar o repositório

```bash
git clone https://github.com/Romanoff-97/vitrine-caldas-novas.git
cd vitrine-caldas-novas
```

2. Configurar o Backend

```bash
cd backend
npm install
```

- Crie um arquivo .env na raiz da pasta backend com a string de conexão do MongoDB: `MONGODB_URI=sua_string_de_conexao PORT=3000`
- Inicie o servidor:

```bash
npm run dev
```

3. Configurar o Frontend

Em um novo terminal:

```bash
cd frontend
npm install
ng serve
```

Acesse http://localhost:4200 no navegador (ou a porta que possa ter informado com o comando --port).

👥 Autoria

- Desenvolvido por Nathalya Santos Cidreira (RU: 4926608) para a Atividade Extensionista II.
