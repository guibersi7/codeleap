# CodeLeap Network - Frontend

Este é o frontend do projeto CodeLeap Network, desenvolvido com Next.js 15, TypeScript e Tailwind CSS.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **clsx & tailwind-merge** - Utilitários para classes CSS
- **Context API** - Gerenciamento de estado global
- **localStorage** - Persistência de dados do usuário

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Grupo de rotas de autenticação
│   │   ├── layout.tsx     # Layout para rotas de auth
│   │   ├── page.tsx       # Página de boas-vindas (rota raiz)
│   │   └── welcome/       # Rota /welcome
│   │       └── page.tsx   # Página de boas-vindas
│   ├── (dashboard)/       # Grupo de rotas do dashboard
│   │   ├── layout.tsx     # Layout para rotas do dashboard
│   │   └── dashboard/     # Rota /dashboard
│   │       └── page.tsx   # Página principal do dashboard
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal da aplicação
│   ├── page.tsx           # Página raiz (redirecionamento)
│   └── routes.ts          # Configuração das rotas
├── components/             # Componentes React
│   ├── CreatePost.tsx     # Formulário para criar posts
│   ├── DebugAuth.tsx      # Componente de debug para autenticação
│   ├── Header.tsx         # Cabeçalho da aplicação com logout
│   ├── PostCard.tsx       # Card individual de post
│   ├── PostsList.tsx      # Lista de posts com estados
│   └── WelcomeScreen.tsx  # Tela de boas-vindas
├── contexts/               # Contextos React
│   └── UserContext.tsx    # Contexto do usuário com persistência
├── hooks/                  # Hooks personalizados
│   ├── useAuth.ts         # Hook para gerenciar autenticação
│   └── usePosts.ts        # Hook para gerenciar posts
├── lib/                    # Utilitários
│   └── utils.ts           # Funções utilitárias
├── types/                  # Tipos TypeScript
│   └── index.ts           # Definições de tipos
└── middleware.ts           # Middleware do Next.js
```

## 🛣️ Estrutura de Rotas

### **App Router (Next.js 15)**

- **`/`** → Redireciona para `/welcome`
- **`/welcome`** → Tela de boas-vindas (signup)
- **`/dashboard`** → Main Screen com lista de posts

### **Grupos de Rotas**

- **`(auth)`** - Rotas de autenticação com UserProvider
- **`(dashboard)`** - Rotas do dashboard com UserProvider

### **Layouts**

- **Layout Principal** - Configuração global (fontes, metadados)
- **Layout Auth** - UserProvider para rotas de autenticação
- **Layout Dashboard** - UserProvider para rotas do dashboard

## 🔐 Sistema de Autenticação

### **Context API com Persistência**

O projeto utiliza **Context API** para gerenciar o estado global do usuário com persistência automática no `localStorage`.

#### **Funcionalidades:**

- ✅ **Login automático** - Username salvo no localStorage
- ✅ **Persistência de sessão** - Dados mantidos entre recarregamentos
- ✅ **Expiração automática** - Sessão expira após 24 horas
- ✅ **Logout funcional** - Botão no header para sair
- ✅ **Proteção de rotas** - Hooks para verificar autenticação
- ✅ **Redirecionamento automático** - Baseado no estado de autenticação

#### **Hooks de Autenticação:**

```typescript
// Hook principal para usuário
const { user, login, logout, updateUser } = useUser();

// Hook para verificar autenticação
const { isAuthenticated, username } = useAuth();

// Hook para proteger rotas
const { isAuthenticated } = useRequireAuth();

// Hook para rotas que não devem ser acessadas quando autenticado
const { isAuthenticated } = useRequireNoAuth();
```

#### **Estrutura do Usuário:**

```typescript
interface User {
  username: string; // Nome do usuário
  isAuthenticated: boolean; // Status de autenticação
  lastLogin?: string; // Data do último login (ISO string)
}
```

#### **Persistência Local:**

- **Chave**: `codeleap_user`
- **Formato**: JSON stringificado
- **Validação**: Verificação de expiração (24 horas)
- **Recuperação**: Automática ao carregar a página
- **Sincronização**: Entre abas do navegador

## 🎯 Funcionalidades Implementadas

### ✅ Tela de Boas-vindas (Signup) - `/welcome`

- Modal de entrada do username com largura fixa de 500px
- Validação do campo (botão desabilitado quando vazio)
- Design responsivo e acessível
- **Login automático** com persistência no localStorage
- Transição automática para o dashboard após inserir username
- Fonte Roboto em todo o projeto
- Texto digitado com cor #000000 (preto)
- Redirecionamento automático se já estiver logado
- **Estados de loading** durante o processo de login

### ✅ Main Screen (Dashboard) - `/dashboard`

- **Header azul** (#6B80F0) com título "CodeLeap Network"
- **Informações do usuário** exibidas no header
- **Botão de logout** funcional no header
- **Formulário de criação de posts** com:

  - Campo de título com placeholder "Hello world"
  - Campo de conteúdo com placeholder "Content here"
  - Botão "Create" que fica desabilitado quando campos estão vazios
  - Botão com cor azul (#7695EC) conforme design
  - **Validação de autenticação** antes de permitir criação

- **Lista de posts** com:

  - Cards individuais com header azul (#6B80F0)
  - Título do post em branco
  - Informações do autor (@username) e tempo relativo
  - Conteúdo do post em texto preto
  - **Ícones de ação** (editar/excluir) apenas para posts próprios
  - **Ordenação automática** por data (mais recente primeiro)

- **Funcionalidades de edição e exclusão**:
  - **Modal de exclusão** com confirmação "Are you sure you want to delete this item?"
  - **Modal de edição** com campos de título e conteúdo
  - Validação de campos obrigatórios
  - Estados de loading durante operações
  - **Verificação de propriedade** dos posts

### ✅ Sistema de Usuário Avançado

- **Context API robusto** para gerenciar estado global
- **Persistência automática** no localStorage
- **Expiração de sessão** após 24 horas
- **Sincronização entre abas** do navegador
- **Hooks personalizados** para autenticação
- **Proteção de rotas** automática
- **Redirecionamento inteligente** baseado no estado
- **Logout funcional** com limpeza de dados

### ✅ Integração com API

- Hook personalizado para operações CRUD
- Atualização automática da lista após operações
- Tratamento de erros e estados de loading
- Ordenação automática por data de criação
- **Username persistido** usado automaticamente nas requests

### ✅ Estrutura Base

- Layout responsivo para todos os dispositivos
- Componentes reutilizáveis e bem estruturados
- Hooks personalizados para API e autenticação
- Tipagem TypeScript completa
- Design system consistente com cores e espaçamentos
- **App Router** com grupos de rotas organizados
- **Middleware** para proteção de rotas

## 🧩 Componentes

### **CreatePost**

- Formulário para criação de novos posts
- Validação de campos obrigatórios
- Botão com estado desabilitado quando campos vazios
- Design responsivo e acessível
- **Verificação de autenticação** antes de permitir criação

### **PostsList**

- Lista responsiva de todos os posts
- Estados de loading, erro e lista vazia
- Ordenação automática por data de criação
- Integração com hook usePosts

### **PostCard**

- Card individual para cada post
- Header azul com título e ações
- Informações do autor e tempo relativo
- Modais de edição e exclusão
- Ícones de ação apenas para posts próprios
- **Estados de loading** durante operações

### **Header**

- Cabeçalho azul com título da aplicação
- **Informações do usuário** exibidas
- **Botão de logout** funcional
- Design responsivo e consistente
- Cor #6B80F0 conforme especificação

### **WelcomeScreen**

- Modal de entrada do username
- **Login automático** com persistência
- Validação e redirecionamento automático
- Design centralizado com largura fixa de 500px
- **Estados de loading** durante o processo

### **DebugAuth** (Desenvolvimento)

- Componente de debug para mostrar estado da autenticação
- Só aparece em modo desenvolvimento
- Posicionado no canto inferior direito
- Mostra dados completos do usuário

## 🔌 API Integration

### **Schema dos Posts**

```typescript
interface Post {
  id: number; // ID único do post
  username: string; // Nome do usuário que criou o post
  created_datetime: string; // Data e hora de criação (ISO 8601)
  title: string; // Título do post
  content: string; // Conteúdo do post
}
```

### **Endpoints da API**

- **GET** `/careers/` - Lista todos os posts
- **POST** `/careers/` - Cria um novo post
- **PATCH** `/careers/{id}/` - Atualiza um post existente
- **DELETE** `/careers/{id}/` - Remove um post

### **Configuração da API**

- **URL Base**: Configurável via `NEXT_PUBLIC_API_URL`
- **Padrão**: REST API com JSON
- **Autenticação**: Baseada em username persistido
- **Ordenação**: Automática por data de criação (mais recente primeiro)

### **URLs da API**

- **Desenvolvimento**: `http://localhost:8000/careers/`
- **Produção**: `https://dev.codeleap.co.uk/careers/`

## 🚀 Como Executar

### **1. Configurar o Backend Django**

```bash
# Navegar para a pasta backend
cd ../backend

# Ativar ambiente virtual
source venv/bin/activate

# Executar o servidor Django
python manage.py runserver 8000
```

### **2. Configurar o Frontend**

```bash
# Navegar para a pasta frontend
cd ../frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

### **3. Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na pasta frontend:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/careers

# Development
NODE_ENV=development
```

## 🌐 Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/careers/
- **Admin Django**: http://localhost:8000/admin/
- **Rotas:**
  - `/` → Redireciona para `/welcome`
  - `/welcome` → Tela de boas-vindas
  - `/dashboard` → Main Screen

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🎨 Design System

### Cores

- **Header e Post Headers:** #6B80F0 (azul)
- **Botão Create:** #7695EC (azul claro)
- **Fundo:** #E5E5E5 (cinza claro)
- **Cards:** #FFFFFF (branco)
- **Texto:** #000000 (preto)
- **Texto secundário:** #6B7280 (cinza)

### Tipografia

- **Fonte principal:** Roboto (400, 500, 700)
- **Títulos:** Roboto Bold (700)
- **Texto:** Roboto Regular (400)
- **Botões:** Roboto Medium (500)

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/careers
```

### Tailwind CSS

Configurado com:

- Cores personalizadas
- Tipografia responsiva
- Componentes utilitários
- Sistema de sombras e bordas

### App Router

- **Grupos de rotas** para organização
- **Layouts aninhados** para reutilização
- **Middleware** para proteção de rotas
- **Redirecionamento automático** baseado no estado

## 📋 Funcionalidades da Main Screen

### ✅ Implementadas

- [x] Criação de posts
- [x] Listagem de posts do backend
- [x] Modal de exclusão (apenas para posts próprios)
- [x] Modal de edição (apenas para posts próprios)
- [x] Atualização automática da lista
- [x] Ordenação por data (mais recente primeiro)
- [x] Verificação de propriedade dos posts
- [x] Estados de loading e erro
- [x] Validação de campos obrigatórios
- [x] **Sistema de rotas organizado**
- [x] **Redirecionamento automático**
- [x] **Integração completa com API**
- [x] **Componente PostsList dedicado**
- [x] **Backend Django funcionando**
- [x] **Sistema de autenticação com Context API**
- [x] **Persistência de dados no localStorage**
- [x] **Proteção de rotas automática**
- [x] **Logout funcional no header**
- [x] **Expiração de sessão automática**
- [x] **Sincronização entre abas do navegador**

### 🔄 Próximos Passos

- [ ] Implementar busca e filtros
- [ ] Adicionar paginação
- [ ] Implementar testes unitários
- [ ] Otimizar performance
- [ ] Implementar PWA

## 📚 Documentação Adicional

- **API Documentation**: Veja `API_DOCS.md` para detalhes completos da API
- **Backend Documentation**: Veja `../backend/README.md` para detalhes do Django
- **Testing Integration**: Veja `../TESTING_INTEGRATION.md` para testar a integração
- **TypeScript Types**: Todos os tipos estão definidos em `src/types/index.ts`
- **Hooks**: Documentação dos hooks personalizados em `src/hooks/`

## 🔐 Funcionalidades de Autenticação

### **Login Automático**

- Username digitado na tela de boas-vindas é salvo automaticamente
- Dados persistidos no localStorage do navegador
- Sessão mantida entre recarregamentos da página
- Redirecionamento automático para o dashboard

### **Persistência de Sessão**

- Dados do usuário salvos automaticamente
- Recuperação automática ao carregar a página
- Sincronização entre abas do navegador
- Validação de expiração (24 horas)

### **Proteção de Rotas**

- Dashboard só acessível para usuários autenticados
- Tela de boas-vindas redireciona usuários já logados
- Middleware para proteção adicional
- Hooks para verificação de autenticação

### **Logout Funcional**

- Botão de logout no header
- Limpeza automática de dados locais
- Redirecionamento para tela de boas-vindas
- Sessão encerrada em todas as abas

### **Estados de Loading**

- Indicadores visuais durante operações
- Botões desabilitados durante processamento
- Feedback visual para o usuário
- Prevenção de múltiplos cliques

## 🤝 Contribuição

Este é um projeto de teste para a vaga na CodeLeap. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.
