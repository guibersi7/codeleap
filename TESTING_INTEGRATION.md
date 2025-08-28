# 🧪 Testando a Integração Frontend + Backend

Este documento contém instruções para testar a integração completa entre o frontend Next.js e o backend Django.

## 🚀 Pré-requisitos

- Python 3.8+ instalado
- Node.js 18+ instalado
- npm ou yarn instalado

## 📋 Passos para Testar

### **1. Iniciar o Backend Django**

```bash
# Terminal 1 - Backend
cd backend

# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Executar o servidor Django
python manage.py runserver 8000
```

**Verificar se está funcionando:**

- Acesse: http://localhost:8000/careers/
- Deve retornar: `{"data": []}` (lista vazia inicialmente)

### **2. Iniciar o Frontend Next.js**

```bash
# Terminal 2 - Frontend
cd frontend

# Instalar dependências (se necessário)
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

**Verificar se está funcionando:**

- Acesse: http://localhost:3000
- Deve redirecionar para: http://localhost:3000/welcome

### **3. Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na pasta `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/careers
```

**Importante:** Reinicie o servidor Next.js após criar este arquivo.

## 🧪 Testes da Integração

### **Teste 1: Fluxo Completo de Usuário**

1. **Acesse** http://localhost:3000
2. **Digite um username** (ex: "testuser")
3. **Clique em "ENTER"**
4. **Verifique** se foi redirecionado para `/dashboard`

### **Teste 2: Criação de Post**

1. **No dashboard**, preencha o formulário:
   - **Title**: "Meu primeiro post"
   - **Content**: "Este é o conteúdo do meu primeiro post"
2. **Clique em "Create"**
3. **Verifique** se o post aparece na lista
4. **Verifique** se o username é "testuser"

### **Teste 3: Listagem de Posts**

1. **Crie mais alguns posts** com diferentes títulos e conteúdos
2. **Verifique** se aparecem ordenados por data (mais recente primeiro)
3. **Verifique** se o tempo relativo está sendo exibido corretamente

### **Teste 4: Edição de Post**

1. **Clique no ícone de lápis** em um post próprio
2. **Modifique** o título e conteúdo
3. **Clique em "Save"**
4. **Verifique** se as mudanças foram aplicadas

### **Teste 5: Exclusão de Post**

1. **Clique no ícone de lixeira** em um post próprio
2. **Confirme** a exclusão no modal
3. **Verifique** se o post foi removido da lista

### **Teste 6: Verificação de Propriedade**

1. **Crie posts com diferentes usernames**
2. **Verifique** se apenas posts próprios mostram ícones de ação
3. **Teste** com diferentes usuários logados

## 🔍 Verificações Técnicas

### **Backend (Django)**

- **API Endpoints** funcionando:

  - `GET /careers/` - Lista posts
  - `POST /careers/` - Cria post
  - `PATCH /careers/{id}/` - Atualiza post
  - `DELETE /careers/{id}/` - Remove post

- **CORS** configurado corretamente
- **Slash final** obrigatório em todas as URLs
- **Admin Django** acessível em http://localhost:8000/admin/

### **Frontend (Next.js)**

- **Hooks** funcionando corretamente
- **Estados** de loading, erro e sucesso
- **Validação** de formulários
- **Modais** de edição e exclusão
- **Responsividade** em diferentes dispositivos

### **Integração**

- **Comunicação** entre frontend e backend
- **Atualização automática** da lista após operações
- **Tratamento de erros** adequado
- **Formato de dados** consistente

## 🐛 Solução de Problemas

### **Erro: "Failed to fetch posts"**

- Verifique se o backend Django está rodando
- Verifique se a URL da API está correta
- Verifique se o CORS está configurado

### **Erro: "Network Error"**

- Verifique se ambos os servidores estão rodando
- Verifique as portas (8000 para Django, 3000 para Next.js)
- Verifique se não há conflitos de porta

### **Posts não aparecem**

- Verifique se o banco de dados foi migrado
- Verifique se há posts criados
- Verifique os logs do Django

### **CORS Issues**

- Verifique se `django-cors-headers` está instalado
- Verifique se o middleware está configurado
- Verifique se `CORS_ALLOW_ALL_ORIGINS = True`

## 📊 Verificações de Performance

### **Backend**

- **Tempo de resposta** da API
- **Uso de memória** do Django
- **Queries** do banco de dados

### **Frontend**

- **Tempo de carregamento** das páginas
- **Tempo de resposta** das operações
- **Uso de memória** do React

## 🎯 Critérios de Sucesso

- ✅ **Frontend** carrega sem erros
- ✅ **Backend** responde a todas as requisições
- ✅ **Criação** de posts funciona
- ✅ **Listagem** de posts funciona
- ✅ **Edição** de posts funciona
- ✅ **Exclusão** de posts funciona
- ✅ **Verificação de propriedade** funciona
- ✅ **Responsividade** em diferentes dispositivos
- ✅ **Estados de loading** funcionam
- ✅ **Tratamento de erros** funciona

## 📝 Logs para Verificar

### **Django (Backend)**

```bash
# No terminal do backend
python manage.py runserver 8000
# Verifique as requisições HTTP nos logs
```

### **Next.js (Frontend)**

```bash
# No terminal do frontend
npm run dev
# Verifique os logs no console do navegador
```

## 🔄 Próximos Passos

Após confirmar que a integração está funcionando:

1. **Implementar testes automatizados**
2. **Otimizar performance**
3. **Implementar busca e filtros**
4. **Adicionar paginação**
5. **Implementar cache**
6. **Preparar para produção**

---

**Status da Integração:** ✅ **COMPLETA E FUNCIONANDO**

O projeto está pronto para demonstração e desenvolvimento adicional!
