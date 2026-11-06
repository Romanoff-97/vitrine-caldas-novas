# 📋 Registro de Implementação e Evolução (Walkthrough)

Este documento acompanha a evolução das implementações e refatorações no projeto **Vitrine Caldas Novas**.

---

## 🎯 Objetivo Atual: Arquitetura de Layout e Responsividade do Consumidor

Garantir que a casca visual da aplicação (card com bordas arredondadas, sombras e proporção adequada à tela) seja gerenciada de forma centralizada pelo roteamento do Angular, estabelecendo uma altura mínima (`min-h-[70vh] md:min-h-[75vh] max-h-[90vh]`) que impeça que páginas com poucos elementos (como apenas uma feira cadastrada) colapsem e pareçam pequenas em telas mobile e tablets.

---

## 🏗️ Status das Etapas

| Etapa       | Descrição                                                                                |    Status    |
| :---------- | :--------------------------------------------------------------------------------------- | :----------: |
| **Etapa 1** | Criação do `LayoutConsumidorComponent` e configuração de rotas filhas em `app.routes.ts` | Concluída ✅ |
| **Etapa 2** | Refatoração da `HomeComponent` (remoção da casca duplicada e ajuste do host flex)        | Concluída ✅ |
| **Etapa 3** | Refatoração da `LojasComponent` (remoção da casca duplicada, contraste e host flex)      | Concluída ✅ |

---

## 🛠️ Detalhes das Alterações Realizadas

### Etapa 1: LayoutConsumidorComponent e Roteamento

1. **Criação do componente de layout:**
   - [layout-consumidor.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/layouts/layout-consumidor/layout-consumidor.component.ts): Componente standalone com `RouterOutlet`.
   - [layout-consumidor.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/layouts/layout-consumidor/layout-consumidor.component.html): Estrutura com `<main>` e card container com `min-h-[70vh] md:min-h-[75vh] max-h-[90vh]` e `<router-outlet>`.
   - [layout-consumidor.component.scss](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/layouts/layout-consumidor/layout-consumidor.component.scss): Folha de estilo do layout.

   **Código da casca centralizada:**

   ```html
   <main
     class="bg-gray-100 min-h-screen p-4 md:p-8 flex justify-center items-center"
   >
     <div
       class="w-full max-w-[375px] md:max-w-xl lg:max-w-2xl min-h-[70vh] md:min-h-[75vh] max-h-[90vh] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col my-auto transition-all"
     >
       <router-outlet></router-outlet>
     </div>
   </main>
   ```

2. **Rotas filhas configuradas:**
   - [app.routes.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/app.routes.ts) agora utiliza o layout como container pai para as rotas da Home e Lojas da Feira:
   ```typescript
   export const routes: Routes = [
     {
       path: "",
       component: LayoutConsumidorComponent,
       children: [
         { path: "", component: HomeComponent },
         { path: "feira/:id", component: LojasComponent },
       ],
     },
     { path: "**", redirectTo: "" },
   ];
   ```

### Etapa 2: Refatoração da HomeComponent

1. **Host com preenchimento flexível:**
   - [home.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/home/home.component.ts): Adicionada propriedade `host: { class: 'flex flex-col flex-1 min-h-0' }` para que a visualização preencha toda a altura disponibilizada pelo layout pai.
2. **Remoção de tags duplicadas:**
   - [home.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/home/home.component.html): Removidas as tags `<main>` e o `<div>` de casca externa, mantendo apenas o `<header>` verde e a `<section class="flex-1 ...">` com a listagem de feiras.

### Etapa 3: Refatoração da LojasComponent

1. **Host com preenchimento flexível:**
   - [lojas.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/lojas/lojas.component.ts): Adicionada propriedade `host: { class: 'flex flex-col flex-1 min-h-0' }`.
2. **Remoção de tags duplicadas e preservação de contraste:**
   - [lojas.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/lojas/lojas.component.html): Removidas as tags externas `<main>` e `<div>`. A `<section>` interna recebeu `bg-gray-50 flex-1 ...`, mantendo o fundo sutil que destaca o contraste dos cartões brancos (`article.bg-white`) das lojas.

---

## 🎯 Conclusão e Resultados do Ciclo 1

- **Altura mínima garantida:** Em mobile (`min-h-[70vh]`) e tablet (`md:min-h-[75vh]`), o card não encolhe mais para tamanhos desproporcionais mesmo com apenas um elemento ou em estados vazios/carregando.
- **Scroll interno nativo:** O limite `max-h-[90vh]` ativa o `overflow-y-auto` interno quando há muitas feiras ou lojas, proporcionando comportamento idêntico a aplicativo móvel.
- **SOLID e DRY:** Todo o enquadramento de casca foi centralizado em `LayoutConsumidorComponent`, desacoplando as páginas e facilitando a manutenção e adição de novos fluxos no roteador.

---

## 🛍️ Feature: Perfil da Loja e Suporte a Imagem

Implementação da tela dedicada de **Perfil da Loja** no fluxo do consumidor, expandindo o schema com suporte a `imagemUrl` e criando endpoint específico no backend.

### 🏗️ Status das Etapas (Perfil da Loja)

| Etapa                  | Descrição                                                                                        |    Status    |
| :--------------------- | :----------------------------------------------------------------------------------------------- | :----------: |
| **Etapa 1 (Backend)**  | Adicionar `imagemUrl` no schema e implementar rota `GET /api/lojas/:id` com `.populate('feira')` | Concluída ✅ |
| **Etapa 2 (Frontend)** | Atualizar interface `Loja` e criar método `getLojaPorId` no `ApiService`                         | Concluída ✅ |
| **Etapa 3 (Frontend)** | Criar componente `PerfilLojaComponent` fiel ao mockup e rota no `LayoutConsumidorComponent`      | Concluída ✅ |
| **Etapa 4 (Frontend)** | Permitir navegar da listagem de lojas para o perfil ao clicar no card                            | Concluída ✅ |

### 🛠️ Detalhes das Alterações (Etapa 1 - Backend)

1. **Schema da Loja ([loja.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/models/loja.ts)):**
   - Adicionado `imagemUrl?: string` na interface `ILoja`.
   - Adicionado `imagemUrl: { type: String, required: false }` no `LojaSchema` do Mongoose.
2. **Serviço ([loja-v1.service.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/services/loja-v1.service.ts)):**
   - Adicionado método `buscarPorId(id: string)` que executa `Loja.findById(id).populate('feira')`.
3. **Controlador ([loja-v1.controller.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/controllers/loja-v1.controller.ts)):**
   - Adicionado método `obterPorId` com tratamento de 200, 404 e 500.
4. **Rotas ([routes.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/routes.ts)):**
   - Registrada rota `GET /lojas/:id`.

### 🛠️ Detalhes das Alterações (Etapa 2 - Frontend Tipagem & Service)

1. **Interface Loja ([loja.interface.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/models/loja.interface.ts)):**
   - Adicionado campo opcional `imagemUrl?: string` garantindo tipagem forte.
2. **Serviço HTTP ([api.service.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/services/api.service.ts)):**
   - Adicionado método `getLojaPorId(lojaId: string): Observable<Loja>` consumindo o endpoint `GET /api/lojas/:id`.

### 🛠️ Detalhes das Alterações (Etapa 3 - Frontend PerfilLojaComponent)

1. **Componente de Perfil da Loja:**
   - [perfil-loja.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/perfil-loja/perfil-loja.component.ts): Standalone component com captura do ID via `ActivatedRoute`, consumo do `ApiService`, tratamento de erros e helper para WhatsApp.
   - [perfil-loja.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/perfil-loja/perfil-loja.component.html): Template semântico fiel ao mockup com cabeçalho verde e botão voltar, banner suave `#FDF0DD` com suporte a imagem real ou emoji ilustrativo, badge de categoria, nome e feira, seção "Sobre a loja" e botão fixo CTA de WhatsApp.
   - [perfil-loja.component.scss](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/perfil-loja/perfil-loja.component.scss): Estilos complementares.
2. **Roteamento:**
   - [app.routes.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/app.routes.ts): Registrada rota `{ path: 'loja/:id', component: PerfilLojaComponent }` como filha do `LayoutConsumidorComponent`.

### 🛠️ Detalhes das Alterações (Etapa 4 - Frontend Navegação Integrada)

1. **Integração na Listagem ([lojas.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/lojas/lojas.component.html) e [lojas.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/lojas/lojas.component.ts)):**
   - O corpo do card da loja agora é um link acessível `[routerLink]="['/loja', loja._id]"` com chevron indicativo e efeito hover elegante.
   - Renderização dinâmica do avatar da loja: se `imagemUrl` for URL, renderiza `<img>`; se for emoji ou nulo, exibe emoji centralizado com fallback.
   - O botão "Falar no WhatsApp" foi mantido acessível de forma direta logo abaixo para contato imediato sem atrito.

---

## 🎯 Conclusão e Resultados do Ciclo 2

- **Fluxo do Consumidor Completo:** `Home (Feiras)` ➔ `Lojas da Feira` ➔ `Perfil da Loja` ➔ `Conversa no WhatsApp`.
- **Experiência Visual Fiel & Blurred Backdrop:** Layout do perfil idêntico ao mockup apresentado, agora aprimorado com efeito dinâmico de fundo desfocado (`blur-xl opacity-60`) e imagem nítida centralizada (`object-contain drop-shadow-lg`), evitando cortes indesejados no logotipo ou fotos verticais/quadradas.
- **Resiliência de Dados:** O campo `imagemUrl` comporta tanto URLs completas quanto emojis, tornando a aplicação leve e imediata para cadastros simples de feirantes.

---

## 📅 Feature: Dias de Funcionamento da Loja Vinculados à Feira

Controle rigoroso dos dias da semana em que cada feirante está presente em sua respectiva feira, com validação de escopo no backend e exibição informativa para os consumidores.

### 🏗️ Status das Etapas (Dias de Funcionamento)

| Etapa                  | Descrição                                                                                                                                                   |    Status    |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
| **Etapa 1 (Backend)**  | Adicionar `diasFuncionamento` no modelo `Loja`, implementar validação com base na Feira em `criarLoja` e `atualizarLoja`, e registrar rota `PUT /lojas/:id` | Concluída ✅ |
| **Etapa 2 (Frontend)** | Atualizar interface `Loja`, implementar helper de formatação e exibir dias nos cards da listagem (`LojasComponent`)                                         | Concluída ✅ |
| **Etapa 3 (Frontend)** | Exibir dias de funcionamento na página de Perfil da Loja (`PerfilLojaComponent`)                                                                            | Concluída ✅ |

### 🛠️ Detalhes das Alterações (Etapa 1 - Backend)

1. **Schema da Loja ([loja.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/models/loja.ts)):**
   - Adicionado campo `diasFuncionamento: number[]` na interface `ILoja` e no `LojaSchema` do Mongoose.
2. **Regras de Negócio e Validação ([loja-v1.service.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/services/loja-v1.service.ts)):**
   - `criarLoja`: Busca a feira associada. Se os dias não forem informados, assume automaticamente `[...feira.diasFuncionamento]`. Se informados, valida se todos os dias pertencem aos dias em que a feira opera; caso contrário, lança erro explicativo.
   - `atualizarLoja`: Valida os dias em relação à feira da loja e atualiza os dados via `findByIdAndUpdate`.
3. **Controlador ([loja-v1.controller.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/controllers/loja-v1.controller.ts)):**
   - Adicionado método `atualizar` com captura de erros de validação (400) e 404.
4. **Rotas ([routes.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/routes.ts)):**
   - Registrada rota `PUT /lojas/:id`.

### 🛠️ Detalhes das Alterações (Etapa 2 - Frontend Tipagem & Listagem)

1. **Interface Loja ([loja.interface.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/models/loja.interface.ts)):**
   - Adicionado campo opcional `diasFuncionamento?: number[]`.
2. **Lógica de Formatação ([lojas.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/lojas/lojas.component.ts)):**
   - Implementado método `formatarDias(dias?: number[])` convertendo arrays de índices (0=Dom, ..., 6=Sáb) em nomes legíveis ou 'Todos os dias'.
3. **Visualização nos Cards ([lojas.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/lojas/lojas.component.html)):**
   - Adicionada badge sutil em verde esmeralda ao lado da categoria exibindo os dias em que cada feirante está presente naquela feira.

### 🛠️ Detalhes das Alterações (Etapa 3 - Frontend Perfil da Loja)

1. **Lógica no Componente ([perfil-loja.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/perfil-loja/perfil-loja.component.ts)):**
   - Adicionado o método `formatarDias(dias?: number[]): string` para manter consistência com a formatação apresentada na listagem.
2. **Template Acessível ([perfil-loja.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/perfil-loja/perfil-loja.component.html)):**
   - Adicionada badge harmoniosa com ícone semântico de calendário (`📅` com `aria-hidden="true"`) exibindo os dias em que a loja funciona ao lado da categoria.
   - Preservada a hierarquia visual, semântica WAI-ARIA e responsividade da interface.

---

## 🎯 Conclusão e Resultados do Ciclo 3

- **Consistência de Negócio:** A loja só pode funcionar nos dias em que a sua feira parceira está aberta, garantindo integridade e confiabilidade para o consumidor final.
- **Transparência na Navegação:** O cliente visualiza os dias de atendimento tanto de relance na listagem quanto em detalhes na página de perfil da loja.
- **Validação Segura:** Caso os dias não sejam explicitados no cadastro, o feirante herda todos os dias de funcionamento da feira automaticamente.

---

## 🛠️ Ciclo 4: Área Administrativa (CRUD de Feiras e Lojas)

Implementação do fluxo administrativo completo para criação e edição de Feiras e Lojas no projeto **Vitrine Caldas Novas**, com identidade visual fiel ao mockup do Figma (tema Dark Navy `#1E293B`), formulários reativos (`ReactiveFormsModule`), validações dinâmicas de regras de negócio, máscaras de entrada e rotas dedicadas (`/admin/*`).

### 🏗️ Status das Etapas (Área Administrativa)

| Etapa                  | Descrição                                                                                          |    Status    |
| :--------------------- | :------------------------------------------------------------------------------------------------- | :----------: |
| **Etapa 1 (Backend)**  | Implementar `GET /api/feiras/:id` e `PUT /api/feiras/:id` no serviço, controller e rotas de feiras | Concluída ✅ |
| **Etapa 2 (Frontend)** | Expandir `ApiService` com métodos completos de CRUD para Feiras e Lojas                            | Concluída ✅ |
| **Etapa 3 (Frontend)** | Criar componente `FormFeiraComponent` sob o tema Dark Navy do Figma com seletor de dias            | Concluída ✅ |
| **Etapa 4 (Frontend)** | Criar componente `FormLojaComponent` com seleção dinâmica de dias atrelados à feira                | Concluída ✅ |
| **Etapa 5 (Frontend)** | Configurar rotas `/admin/*` e adicionar pontos de acesso na Home, Lojas e Perfil                   | Concluída ✅ |

---

### 🛠️ Detalhes das Alterações Realizadas

#### 1. Backend

1. **Serviço de Feiras ([feira-v1.service.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/services/feira-v1.service.ts)):**
   - Adicionado método `buscarPorId(id: string)` utilizando `Feira.findById(id)`.
   - Adicionado método `atualizarFeira(id: string, dados: Partial<IFeira>)` com retorno atualizado `{ new: true, runValidators: true }`.
2. **Controlador de Feiras ([feira-v1.controller.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/controllers/feira-v1.controller.ts)):**
   - Adicionado método `obterPorId` com tratamento de 200, 404 (Feira não encontrada) e 500.
   - Adicionado método `atualizar` com tratamento de payload, 200, 400 (validação) e 404.
3. **Rotas da API ([routes.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/routes.ts)):**
   - Registradas rotas REST `GET /feiras/:id` e `PUT /feiras/:id`.

#### 2. Frontend

1. **Serviço de Integração HTTP ([api.service.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/services/api.service.ts)):**
   - Adicionados métodos tipados para consumo da API REST:
     - `getFeiraPorId(id: string): Observable<Feira>`
     - `criarFeira(dados: Partial<Feira>): Observable<Feira>`
     - `atualizarFeira(id: string, dados: Partial<Feira>): Observable<Feira>`
     - `criarLoja(dados: Partial<Loja>): Observable<Loja>`
     - `atualizarLoja(id: string, dados: Partial<Loja>): Observable<Loja>`
2. **Formulário de Feira ([form-feira.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/form-feira/form-feira.component.ts) e [form-feira.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/form-feira/form-feira.component.html)):**
   - Componente standalone reativo (`ReactiveFormsModule`).
   - Gerenciamento dos campos: Nome da feira, Localização/Endereço, Dias de Funcionamento e Status (Ativa / Inativa).
   - Seletor acessível de dias da semana com `aria-pressed` e alternância visual.
   - Comportamento unificado para criação (`/admin/feiras/nova`) e edição (`/admin/feiras/:id/editar`).
   - Cabeçalho e botões com tema Dark Navy (`#1E293B`) do Figma.
3. **Formulário de Loja ([form-loja.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/form-loja/form-loja.component.ts) e [form-loja.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/form-loja/form-loja.component.html)):**
   - Componente standalone reativo (`ReactiveFormsModule`).
   - Dropdown de seleção de Feira: ao selecionar a feira, o componente recalcula automaticamente os dias de funcionamento disponíveis, impedindo que o feirante selecione dias em que a feira não opera.
   - Campos: Nome da loja, Categoria, Feira parceira, Dias de funcionamento, Telefone WhatsApp (com formatação e máscara em tempo real), Descrição e URL/Emoji da imagem.
   - Suporte a criação (`/admin/lojas/nova`) e edição (`/admin/lojas/:id/editar`).
4. **Roteamento ([app.routes.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/app.routes.ts)):**
   - Registradas as 4 rotas administrativas dentro da casca responsiva do `LayoutConsumidorComponent`:
     - `admin/feiras/nova` ➔ `FormFeiraComponent`
     - `admin/feiras/:id/editar` ➔ `FormFeiraComponent`
     - `admin/lojas/nova` ➔ `FormLojaComponent`
     - `admin/lojas/:id/editar` ➔ `FormLojaComponent`
5. **Pontos de Acesso na Interface:**
   - **Home ([home.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/home/home.component.html)):** Botão "+ Nova Feira" no topo e botão de edição (lápis) em cada card de feira.
   - **Lojas ([lojas.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/lojas/lojas.component.html)):** Botão "+ Nova Loja" no cabeçalho e botão de edição rápida em cada loja listada.
   - **Perfil da Loja ([perfil-loja.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/perfil-loja/perfil-loja.component.html)):** Botão de ação "Editar Loja" no cabeçalho da página.

---

## 🎯 Conclusão e Resultados do Ciclo 4

- **Ciclo de Gestão Completo:** Feiras e lojas podem ser criadas e atualizadas diretamente pelo navegador.
- **Validação Cruzada de Regras:** Dias de atendimento da loja são estritamente limitados aos dias em que a respectiva feira opera.
- **Acessibilidade e Semântica:** Uso de elementos semânticos (`<header>`, `<main>`, `<form>`, `<fieldset>`, `<legend>`, `<section>`), atributos WAI-ARIA (`aria-label`, `aria-pressed`, `aria-busy`), e compatibilidade total com o Angular 18 (`@if`, `@for` com `track $index`).

---

## 🛡️ Ciclo 5: Painel Central Administrativo (Dashboard) e Autenticação com Chave de Acesso

Implementação do **Painel Central de Gestão** (`/admin`) agrupando feiras e suas respectivas lojas com ações rápidas de criação e edição, além da camada completa de **Segurança e Autenticação Administrativa** (Chave de Acesso / Master PIN com Guard no Angular e Middleware no Express).

### 🏗️ Status das Etapas (Dashboard & Segurança)

| Etapa                             | Descrição                                                                                                           |    Status    |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :----------: |
| **Etapa 1 (Frontend Dashboard)**  | Criar `AdminDashboardComponent` com listagem de feiras e lojas agrupadas, expansão dinâmica e ações                 | Concluída ✅ |
| **Etapa 2 (Frontend Roteamento)** | Registrar rota `/admin`, atalho de engrenagem na Home e suporte a queryParam `feiraId` no `FormLojaComponent`       | Concluída ✅ |
| **Etapa 3 (Refatoração de UX)**   | Limpar atalhos de edição das telas do consumidor (`LojasComponent` e `PerfilLojaComponent`) mantendo o foco público | Concluída ✅ |
| **Etapa 4 (Backend Segurança)**   | Criar `adminAuthMiddleware`, rota `POST /admin/verificar-chave` e proteger rotas de escrita (`POST`/`PUT`)          | Concluída ✅ |
| **Etapa 5 (Frontend Segurança)**  | Criar `AdminAuthService`, `adminAuthGuard`, `adminAuthInterceptor`, tela de login e botão de logout                 | Concluída ✅ |

---

### 🛠️ Detalhes das Alterações Realizadas

#### 1. Painel Central Administrativo (Dashboard)

1. **Componente Dashboard ([admin-dashboard.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/dashboard/admin-dashboard.component.ts) e [admin-dashboard.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/dashboard/admin-dashboard.component.html)):**
   - Cabeçalho administrativo no tema Dark Navy (`#1E293B`) com título, ações rápidas no topo (`+ Nova Feira`, `+ Nova Loja`, `Ver Vitrine` e `🚪 Sair`).
   - Carregamento assíncrono em cascata: lista todas as feiras e busca automaticamente as lojas vinculadas a cada feira (`getLojasPorFeira`).
   - Cards de Feiras com status visual (`Ativa` / `Inativa`), endereço, dias de atendimento, atalho de edição (lápis) e botão para recolher/expandir lojas (`aria-expanded`).
   - Sublista de lojas vinculadas: exibe avatar/emoji, nome, categoria, dias em que a loja atende e botão de edição direta (`/admin/loja/:id/editar`).
   - Botão contextual `+ Adicionar Loja` na própria feira que navega com `?feiraId=...`.
2. **Formulário de Loja ([form-loja.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/form-loja/form-loja.component.ts)):**
   - Captura o queryParam `feiraId` para pré-selecionar a feira de origem ao abrir o cadastro a partir do card da feira no painel.
   - Redirecionamento pós-salvamento unificado para retornar ao `/admin`.
3. **Formulário de Feira ([form-feira.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/form-feira/form-feira.component.ts)):**
   - Redirecionamento pós-salvamento ajustado para retornar ao `/admin`.
4. **Desacoplamento Visual do Consumidor:**
   - [lojas.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/lojas/lojas.component.html) e [perfil-loja.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/perfil-loja/perfil-loja.component.html): Removidos botões de edição de loja para manter a interface do consumidor 100% voltada à experiência de compra.
   - [home.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/home/home.component.html): Adicionado botão com ícone de engrenagem no cabeçalho para navegação direta ao painel administrativo.

#### 2. Segurança e Autenticação Administrativa (Opção 1)

1. **Middleware no Backend ([admin-auth.middleware.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/middlewares/admin-auth.middleware.ts)):**
   - Valida o cabeçalho `x-admin-key` comparando com a variável de ambiente `process.env.ADMIN_KEY || 'admin123'`.
   - Rejeita com status `401 Unauthorized` requisições sem o cabeçalho ou com chave inválida.
2. **Proteção de Rotas ([routes.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/routes.ts)):**
   - Criada rota de validação prévia `POST /api/admin/verificar-chave`.
   - Protegidas com `adminAuthMiddleware` as operações de escrita: `POST /feiras`, `PUT /feiras/:id`, `POST /lojas` e `PUT /lojas/:id`. Rotas `GET` continuam abertas para leitura do consumidor.
3. **CORS e Configuração ([server.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/server.ts) e [.env](file:///dados/facul/vitrine-caldas-novas/backend/.env)):**
   - `server.ts`: CORS configurado para permitir explicitamente o header `x-admin-key` em requisições cross-origin e requisições preflight (`OPTIONS`).
   - `.env`: Chave local configurada com `ADMIN_KEY=admin123`.
   - `tsconfig.json`: Removida opção depreciada `moduleResolution: "node"`, garantindo compilação estrita com zero erros no TypeScript 7.
4. **Serviço de Autenticação ([admin-auth.service.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/services/admin-auth.service.ts)):**
   - Métodos `login(chave)`, `logout()` e `estaAutenticado()`.
   - Armazenamento temporário seguro em `sessionStorage` (`vitrine_admin_key`), invalidando a sessão automaticamente ao fechar a aba.
5. **Interceptor HTTP ([admin-auth.interceptor.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/interceptors/admin-auth.interceptor.ts)):**
   - Interceptor funcional do Angular 18 registrado no [app.config.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/app.config.ts), anexando automaticamente `x-admin-key: <chave>` a todas as requisições disparadas pelo frontend quando autenticado.
6. **Guarda de Rotas ([admin-auth.guard.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/guards/admin-auth.guard.ts)):**
   - `CanActivateFn` protegendo todas as rotas `/admin`, `/admin/feira/*` e `/admin/loja/*` em [app.routes.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/app.routes.ts).
   - Redireciona usuários não autenticados para `/admin/login`, preservando a URL de retorno via queryParam `?returnUrl=...`.
7. **Tela de Login Administrativo ([admin-login.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/login/admin-login.component.ts) e [admin-login.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/login/admin-login.component.html)):**
   - Interface Dark Navy com ícone temático, campo protegido para chave de segurança, botão de alternância de visibilidade (olho aberto/fechado) e feedback visual de erros e sucesso.

---

## 🎯 Conclusão e Resultados do Ciclo 5

- **Centralização Administrativa:** O administrador tem uma visão panorâmica e intuitiva de todas as feiras e lojas em um único local (`/admin`).
- **Segurança em Duas Camadas:** Nenhuma rota administrativa pode ser aberta no frontend sem login prévio, e nenhum endpoint de criação/edição no backend aceita requisições sem a chave de acesso.
- **Experiência do Consumidor Preservada:** Os fluxos de compra e navegação do consumidor permanecem livres de botões de edição ou configurações indesejadas.

---

## 🔒 Ciclo 6: Reforço de Segurança e Blindagem da API

Implementação de camadas defensivas contra abuso e acessos indevidos: política estrita de **CORS** com whitelist de origens, proteção contra sobrecarga via **Rate Limiting** com `express-rate-limit`, e flexibilização resiliente de autenticação por chave de API (`x-api-key` e `x-admin-key`).

### 🏗️ Status das Etapas (Reforço de Segurança)

| Etapa                  | Descrição                                                                                             |    Status    |
| :--------------------- | :---------------------------------------------------------------------------------------------------- | :----------: |
| **Etapa 1 (Backend)**  | Configurar CORS com whitelist restrita e aplicar Rate Limiting global (100 req / 15 min)              | Concluída ✅ |
| **Etapa 2 (Backend)**  | Aprimorar middleware com proteção contra timing attacks e padronização em `ADMIN_KEY` / `x-admin-key` | Concluída ✅ |
| **Etapa 3 (Frontend)** | Reforçar interceptor e serviço para envio de `x-admin-key` em chamadas protegidas                     | Concluída ✅ |

---

### 🛠️ Detalhes das Alterações Realizadas

#### Backend - CORS Restrito e Rate Limiting (Etapa 1)

1. **Configuração Restrita de CORS ([server.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/server.ts)):**
   - Whitelist restrita contendo:
     - `https://vitrine-cn-frontend.vercel.app` (produção)
     - `http://localhost:4200` (desenvolvimento local)
   - Validação por callback bloqueando qualquer origem não autorizada que tente consumir a API via browser.
   - Cabeçalhos permitidos consolidados: `['Content-Type', 'Authorization', 'x-admin-key']`.
2. **Rate Limiting Global ([server.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/server.ts)):**
   - Utilização da biblioteca `express-rate-limit`.
   - Limite de 100 requisições a cada 15 minutos por endereço IP.
   - Cabeçalhos padrão RFC `draft-7` habilitados (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`).
   - Resposta padronizada e fortemente tipada (`RespostaRateLimit`) retornando status HTTP 429 com tempo de espera informado ao cliente.

#### Backend - Middleware de Autenticação e Rotas Protegidas (Etapa 2)

1. **Criação do Middleware Centralizado ([auth.middleware.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/middlewares/auth.middleware.ts)):**
   - Validação canônica e estrita do header `x-admin-key`.
   - Leitura direta da variável de ambiente `ADMIN_KEY` (com fallback seguro para desenvolvimento local).
   - Implementação de comparação constante no tempo (`crypto.timingSafeEqual`) através da função `compararChavesComSeguranca`, prevenindo vulnerabilidades de timing attack.
   - Resposta padronizada e fortemente tipada com `ErroAutenticacaoResponse` retornando status `401 Unauthorized`.
2. **Compatibilidade Retroativa ([admin-auth.middleware.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/middlewares/admin-auth.middleware.ts)):**
   - Reexportação limpa de `authMiddleware` e utilitários sem duplicação de lógica (DRY e SRP).
3. **Proteção Rigorosa de Rotas ([routes.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/routes.ts)):**
   - Aplicação do `authMiddleware` em todas as rotas de mutação de dados:
     - `POST /feiras` e `PUT /feiras/:id`
     - `POST /lojas` e `PUT /lojas/:id`
   - Endpoint de validação prévia (`POST /admin/verificar-chave`) atualizado com suporte ao header `x-admin-key` ou payload de login, utilizando comparação de tempo constante.
   - Rotas de leitura (`GET /feiras`, `GET /feiras/:id`, `GET /lojas/feira/:feiraId`, `GET /lojas/buscar` e `GET /lojas/:id`) mantidas 100% públicas para livre consulta pelos consumidores.

#### Frontend - Envio de Chave de Autenticação (Etapa 3)

1. **Interceptor HTTP Centralizado ([admin-auth.interceptor.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/interceptors/admin-auth.interceptor.ts)):**
   - Configurado para anexar `x-admin-key` em todas as requisições disparadas quando houver sessão ativa do administrador.
2. **Serviço de Integração HTTP ([api.service.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/services/api.service.ts)):**
   - Injeção tipada de `AdminAuthService` e criação do helper privado `obterHeadersAutenticados(): HttpHeaders`.
   - Injeção explícita do cabeçalho `x-admin-key` nos métodos protegidos:
     - `criarFeira(dados: Partial<Feira>)`
     - `atualizarFeira(id: string, dados: Partial<Feira>)`
     - `criarLoja(dados: Partial<Loja>)`
     - `atualizarLoja(id: string, dados: Partial<Loja>)`
   - Dupla camada defensiva: as requisições possuem garantia de autenticação tanto a nível de serviço quanto na camada global de interceptação do Angular 18.

---

## 🎯 Conclusão e Resultados do Ciclo 6

- **API Blindada contra Abuso e DoS:** Com a inclusão do `express-rate-limit`, ataques de força bruta contra a chave de acesso ou sobrecarga deliberada no servidor são bloqueados no limiar de 100 req/15 min por IP, retornando HTTP 429 em formato padronizado.
- **CORS Restritivo e Seguro:** Origens arbitrárias de navegadores não conseguem mais realizar requisições cross-origin contra a API; apenas o frontend oficial na Vercel e o ambiente de desenvolvimento local (`localhost:4200`) são permitidos.
- **Prevenção de Ataques de Temporização (Timing Attacks):** O uso de `crypto.timingSafeEqual` garante que nenhuma informação sobre o tamanho ou caracteres da chave administrativa vaze através da variação de tempo de resposta do Express.
- **Padronização Única e Sem Redundâncias (`ADMIN_KEY` / `x-admin-key`):** Código 100% limpo e consistente entre Frontend e Backend, eliminando termos duplicados e simplificando a configuração no Render para apenas uma variável: `ADMIN_KEY`.

---

# Ciclo 7 - Upload Real de Imagens no Cloudinary com Multer e Suporte a Câmera/Galeria Mobile

**Data:** 22/09/2026  
**Objetivo:** Implementar o fluxo completo de upload de fotos para as Lojas com persistência direta no Cloudinary via Multer no backend, além de interface administrativa rica no frontend Angular com pré-visualização instantânea e suporte nativo a câmera e galeria em dispositivos móveis.

---

## 🛠️ Modificações Realizadas

| Arquivo                                                           | Ação       | Descrição                                                                                                                                                                                                                                   |
| :---------------------------------------------------------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `backend/package.json`                                            | Modificado | Adicionadas dependências `cloudinary`, `multer`, `multer-storage-cloudinary` e devDependency `@types/multer`.                                                                                                                               |
| `backend/src/config/upload.ts`                                    | Criado     | Configuração do SDK do Cloudinary, instância de armazenamento `CloudinaryStorage` (pasta `vitrine-caldas-novas` e formatos `jpg`, `jpeg`, `png`, `webp`, `avif`) e exportação do middleware `upload`.                                       |
| `backend/src/routes.ts`                                           | Modificado | Injeção do middleware `upload.single('imagem')` nas rotas `POST /lojas` e `PUT /lojas/:id`.                                                                                                                                                 |
| `backend/src/controllers/loja-v1.controller.ts`                   | Modificado | Criação do método privado auxiliar `extrairDadosLoja(req)` (respeitando SRP e DRY) para capturar a URL do Cloudinary (`req.file.path`), realizar parsing seguro de `diasFuncionamento` via `FormData` e integrar com `criar` e `atualizar`. |
| `frontend/src/app/services/api.service.ts`                        | Modificado | Métodos `criarLoja` e `atualizarLoja` tipados para aceitar `FormData \| Partial<Loja>`, mantendo retornos estritamente tipados com `Observable<Loja>`.                                                                                      |
| `frontend/src/app/pages/admin/form-loja/form-loja.component.ts`   | Modificado | Gerenciamento de `fotoFile` e `fotoPreview`, captura via `onFileSelected(event: Event)`, limpeza com `removerFoto()`, helper `fotoTamanhoFormatado` e montagem do `FormData` no método `salvar()`.                                          |
| `frontend/src/app/pages/admin/form-loja/form-loja.component.html` | Modificado | Substituição do input de URL por componente visual de upload acessível, com pré-visualização em tempo real, botões de troca/remoção e acionamento nativo de câmera e galeria no smartphone.                                                 |

---

## 📐 Detalhamento Técnico

### 1. Backend - Integração Cloudinary & Multer

- **Storage e Validação de Formatos ([upload.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/config/upload.ts)):**
  - O SDK do Cloudinary lê automaticamente a variável de ambiente `CLOUDINARY_URL` do `.env`.
  - Configurado `CloudinaryStorage` para salvar os assets na pasta `vitrine-caldas-novas`.
  - Whitelist de formatos rigorosa: `['jpg', 'jpeg', 'png', 'webp', 'avif']`.

- **Middleware nas Rotas ([routes.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/routes.ts)):**
  - O middleware `upload.single('imagem')` foi injetado nas rotas de criação e edição de lojas:
    ```typescript
    router.post(
      "/lojas",
      authMiddleware,
      upload.single("imagem"),
      lojaController.criar,
    );
    router.put(
      "/lojas/:id",
      authMiddleware,
      upload.single("imagem"),
      lojaController.atualizar,
    );
    ```

- **Controller Inteligente e Parsing Seguro ([loja-v1.controller.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/controllers/loja-v1.controller.ts)):**
  - Ao receber requisições `multipart/form-data`, arrays como `diasFuncionamento` chegam como string ou JSON stringificado no `req.body`.
  - O método auxiliar `extrairDadosLoja(req)` realiza o parse seguro de `diasFuncionamento` para `number[]` e extrai `req.file.path` como `imagemUrl` da loja.
  - Caso nenhuma nova imagem seja enviada em uma edição (`PUT`), a foto existente é mantida.

### 2. Frontend - Experiência do Administrador no Angular

- **Suporte Nativo a Câmera e Galeria ([form-loja.component.html](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/form-loja/form-loja.component.html)):**
  - Ao utilizar `<input id="fotoLojaInput" type="file" accept="image/*" ...>`, sistemas operacionais móveis (Android e iOS) abrem nativamente a folha de opções oferecendo:
    - 📷 **Tirar foto com a câmera** na hora.
    - 🖼️ **Escolher imagem existente da galeria** do aparelho.
- **Pré-visualização Instantânea ([form-loja.component.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/pages/admin/form-loja/form-loja.component.ts)):**
  - O método `onFileSelected(event: Event)` utiliza a API nativa `FileReader` para carregar o preview em base64 imediatamente, permitindo ao usuário conferir a qualidade antes de salvar.
  - Exibição de indicador de tamanho em KB (`fotoTamanhoFormatado`) e botões rápidos para "Trocar" ou "Remover".
- **Envio com `FormData` ([api.service.ts](file:///dados/facul/vitrine-caldas-novas/frontend/src/app/services/api.service.ts)):**
  - `criarLoja` e `atualizarLoja` realizam o disparo HTTP com o boundary gerado pelo navegador, transmitindo o arquivo binário junto aos metadados da loja de forma transparente.

---

## 🎯 Conclusão e Resultados do Ciclo 7

- **Fotos Reais e Otimizadas na Nuvem:** Fim das URLs manuais ou emojis provisórios para lojas; todas as imagens são armazenadas de forma segura e com entrega rápida (CDN) pelo Cloudinary.
- **Usabilidade Mobile de Primeiro Nível:** Administradores em campo podem cadastrar lojas e tirar fotos diretamente com o smartphone, sem necessidade de transferir arquivos para o computador.
- **Código Limpo e Princípios SOLID:** Sem acoplamento desnecessário, controllers reutilizando lógica através de métodos privados enxutos e tipagens fortes em todas as camadas.

---

# Ciclo 8 - Exclusão Segura de Feiras e Lojas com Cascata e UI Acessível (WAI-ARIA)

**Data:** 25/09/2026  
**Objetivo:** Implementar o fluxo completo de exclusão para Feiras e Lojas, garantindo segurança estrita das rotas administrativas no backend (`authMiddleware` com validação de `x-admin-key`), integridade referencial com remoção em cascata de lojas vinculadas a feiras excluídas, e interface rica no frontend Angular 18 com modais de confirmação acessíveis (WAI-ARIA) no Dashboard e nas telas de edição.

---

## 🛠️ Modificações Realizadas

| Arquivo                                                                 | Ação       | Descrição                                                                                                                                                                   |
| :---------------------------------------------------------------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/src/services/feira-v1.service.ts`                              | Modificado | Adicionado método `excluirFeira(id: string)` que remove em cascata todas as lojas vinculadas (`Loja.deleteMany({ feira: id })`) e exclui a feira do banco de dados.         |
| `backend/src/services/loja-v1.service.ts`                               | Modificado | Adicionado método `excluirLoja(id: string)` que remove o registro da loja via `Loja.findByIdAndDelete(id)`.                                                                 |
| `backend/src/controllers/feira-v1.controller.ts`                        | Modificado | Adicionada action `excluir` fortemente tipada com respostas HTTP padronizadas (200 para sucesso, 404 para feira não encontrada e 500 para erro interno).                    |
| `backend/src/controllers/loja-v1.controller.ts`                         | Modificado | Adicionada action `excluir` fortemente tipada com respostas HTTP padronizadas (200 para sucesso, 404 para loja não encontrada e 500 para erro interno).                     |
| `backend/src/routes.ts`                                                 | Modificado | Registrados os novos endpoints `DELETE /feiras/:id` e `DELETE /lojas/:id`, ambos protegidos pelo `authMiddleware`.                                                          |
| `frontend/src/app/models/resposta-api.interface.ts`                     | Criado     | Criada interface `RespostaMensagem` (`{ mensagem: string }`) garantindo forte tipagem para retornos informativos da API.                                                    |
| `frontend/src/app/services/api.service.ts`                              | Modificado | Implementados os métodos `excluirFeira(id: string)` e `excluirLoja(id: string)` retornando `Observable<RespostaMensagem>` e com inclusão de cabeçalho `x-admin-key`.        |
| `frontend/src/app/pages/admin/dashboard/admin-dashboard.component.ts`   | Modificado | Implementada interface `ItemExclusaoAdmin`, gerenciamento de estado do modal de exclusão e remoção reativa de feiras/lojas da interface sem necessidade de reload completo. |
| `frontend/src/app/pages/admin/dashboard/admin-dashboard.component.html` | Modificado | Adicionados botões de lixeira acessíveis no cabeçalho das feiras e nas linhas de lojas, banner de sucesso e modal de confirmação com aviso de exclusão em cascata.          |
| `frontend/src/app/pages/admin/form-feira/form-feira.component.ts`       | Modificado | Adicionados métodos para abertura de modal, cancelamento e confirmação de exclusão da feira em edição com redirecionamento para o dashboard.                                |
| `frontend/src/app/pages/admin/form-feira/form-feira.component.html`     | Modificado | Adicionado botão secundário "Excluir" visível apenas em modo de edição (`isEdicao === true`) e modal acessível de confirmação com alerta de cascata.                        |
| `frontend/src/app/pages/admin/form-loja/form-loja.component.ts`         | Modificado | Adicionados métodos para abertura de modal, cancelamento e confirmação de exclusão da loja em edição com redirecionamento para o dashboard.                                 |
| `frontend/src/app/pages/admin/form-loja/form-loja.component.html`       | Modificado | Adicionado botão secundário "Excluir" visível apenas em modo de edição (`isEdicao === true`) e modal acessível de confirmação.                                              |

---

## 📐 Detalhamento Técnico

### 1. Backend e Segurança das Rotas

- **Proteção Rigorosa com `authMiddleware` ([routes.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/routes.ts)):**
  - As rotas de remoção foram configuradas exclusivamente com proteção:
    ```typescript
    router.delete("/feiras/:id", authMiddleware, feiraController.excluir);
    router.delete("/lojas/:id", authMiddleware, lojaController.excluir);
    ```
  - Acesso não autorizado retorna status `401 Unauthorized` de forma constante no tempo (`crypto.timingSafeEqual`), eliminando vulnerabilidades a ataques de temporização (_timing attacks_).

- **Integridade Referencial e Exclusão em Cascata ([feira-v1.service.ts](file:///dados/facul/vitrine-caldas-novas/backend/src/services/feira-v1.service.ts)):**
  - Ao remover uma feira, todas as lojas vinculadas são deletadas previamente através de `await Loja.deleteMany({ feira: id })`. Isso impede a permanência de registros órfãos no banco de dados MongoDB.

### 2. Frontend e Experiência do Administrador

- **Acessibilidade Semântica e WAI-ARIA:**
  - Os modais de confirmação implementam `role="dialog"`, `aria-modal="true"`, `aria-labelledby` e `aria-describedby`, assegurando compatibilidade plena com leitores de tela.
  - Todos os botões interativos contêm atributos `aria-label` descritivos contextualizados com o nome do registro (ex: `"Excluir feira Feira da Lua"`).
  - Estados visuais de foco (`focus:ring-2`) e hover com contraste elevado em tons de vermelho/rosa.

- **Atualização Reativa de Estado:**
  - No Dashboard Administrativo, após a confirmação de exclusão pela API, a lista local `feirasAdmin` é atualizada instantaneamente (filtrando o item excluído ou removendo a loja do array interno da feira), oferecendo resposta visual sem recarregar a página.

- **Regras Angular 18:**
  - Utilização estrita das diretivas nativas `@if` e `@for (track $index)`, em total conformidade com os padrões modernos da aplicação.

---

- **Prevenção de Erros Acidentais:** A exclusão requer dupla confirmação visual do usuário através de diálogo modal acessível com advertência clara sobre a perda irreversível dos dados e efeitos em cascata.

---

# Ciclo 9 - Geolocalização via Google Maps e Contexto da Feira na Listagem de Lojas

**Data:** 25/09/2026  
**Objetivo:** Permitir o cadastro da URL de localização do Google Maps para feiras e exibir atalho de rota ("Como chegar") na listagem de lojas, acompanhado dos dados contextuais da feira (nome, endereço e dias de funcionamento).

---

## 🛠️ Modificações Realizadas

| Arquivo | Ação | Descrição |
| :--- | :--- | :--- |
| `backend/src/models/feira.ts` | Modificado | Adicionada propriedade opcional `mapsUrl?: string` na interface `IFeira` e no `FeiraSchema` do Mongoose. |
| `frontend/src/app/models/feira.interface.ts` | Modificado | Atualizada a interface `Feira` com a propriedade opcional `mapsUrl?: string`. |
| `frontend/src/app/pages/admin/form-feira/form-feira.component.ts` | Modificado | Adicionado controle `mapsUrl` no formulário reativo, carga do dado na edição e inclusão no payload de salvamento. |
| `frontend/src/app/pages/admin/form-feira/form-feira.component.html` | Modificado | Inserido campo de entrada para link do Google Maps com ícone 📍, placeholder e instruções de uso. |
| `frontend/src/app/pages/admin/dashboard/admin-dashboard.component.html` | Modificado | Inserido atalho visual "Maps ↗" junto ao endereço da feira para consulta rápida pelo administrador. |
| `frontend/src/app/pages/lojas/lojas.component.ts` | Modificado | Adicionada propriedade `feira` e busca dos dados completos da feira via `apiService.getFeiraPorId(feiraId)`. |
| `frontend/src/app/pages/lojas/lojas.component.html` | Modificado | Inserido botão de pin do Google Maps ("Como chegar") no canto superior direito do cabeçalho e card informativo com endereço e dias de funcionamento da feira. |

---

## 📐 Detalhamento Técnico

### 1. Suporte a Link do Google Maps no Backend e Formulário
- O schema do MongoDB aceita URLs completas ou encurtadas (como `https://maps.app.goo.gl/...`), sem obrigar preenchimento retroativo para feiras existentes.
- O formulário administrativo valida e sanitiza o valor via `trim()`, enviando `undefined` quando vazio para evitar strings em branco no banco.

### 2. Experiência do Usuário e Contexto na Listagem de Lojas
- **Identificação Clara da Feira:** O título principal agora reflete dinamicamente o nome da feira visitada (com fallback para "Lojas da Feira"), eliminando desorientação para usuários que acessam via link direto.
- **Pin de Localização ("Como chegar"):** Posicionado estrategicamente no canto superior direito do cabeçalho, com abertura segura em nova aba (`target="_blank" rel="noopener noreferrer"`), ícone de pin WAI-ARIA (`aria-hidden="true"`) e `aria-label` descritivo.
- **Resumo de Atendimento:** Badge integrada exibindo endereço e dias formatados (ex: `📅 Qui, Sex, Sáb`).
