# CodeLeap Network - Backend

Backend Django para o projeto CodeLeap Network, implementando a API REST conforme especificações.

## 🚀 Tecnologias Utilizadas

- **Django 5.2.5** - Framework web Python
- **Django REST Framework 3.16.1** - Framework para APIs REST
- **Django CORS Headers 4.7.0** - Suporte a CORS
- **SQLite** - Banco de dados (desenvolvimento)

## 📁 Estrutura do Projeto

```
backend/
├── codeleap_backend/     # Configurações principais do Django
│   ├── __init__.py
│   ├── settings.py       # Configurações do projeto
│   ├── urls.py          # URLs principais
│   ├── wsgi.py          # Configuração WSGI
│   └── asgi.py          # Configuração ASGI
├── posts/                # App para gerenciar posts
│   ├── __init__.py
│   ├── admin.py         # Configuração do admin
│   ├── models.py        # Modelo Post
│   ├── serializers.py   # Serializers da API
│   ├── urls.py          # URLs da API
│   └── views.py         # Views da API
├── manage.py            # Script de gerenciamento Django
├── requirements.txt     # Dependências Python
├── README.md           # Esta documentação
└── db.sqlite3          # Banco de dados SQLite
```

## 🔌 API Endpoints

### **Base URL**: `https://dev.codeleap.co.uk/careers/`

### **1. Listar Posts (GET)**

- **URL**: `GET /careers/`
- **Descrição**: Retorna lista de todos os posts
- **Resposta**:

```json
{
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "created_datetime": "2024-01-15T10:30:00Z",
      "title": "Hello World",
      "content": "This is my first post!"
    }
  ]
}
```

### **2. Criar Post (POST)**

- **URL**: `POST /careers/`
- **Descrição**: Cria um novo post
- **Request Body**:

```json
{
  "username": "john_doe",
  "title": "Hello World",
  "content": "This is my first post!"
}
```

- **Resposta**: Post criado com status 201

### **3. Atualizar Post (PATCH)**

- **URL**: `PATCH /careers/{id}/`
- **Descrição**: Atualiza um post existente
- **Request Body**:

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

- **Resposta**: Post atualizado

### **4. Excluir Post (DELETE)**

- **URL**: `DELETE /careers/{id}/`
- **Descrição**: Remove um post
- **Resposta**:

```json
{
  "message": "Post deleted successfully"
}
```

## 🗄️ Modelo de Dados

### **Post Schema**

```python
class Post(models.Model):
    id = models.AutoField(primary_key=True)           # ID único (gerado automaticamente)
    username = models.CharField(max_length=100)       # Nome do usuário
    created_datetime = models.DateTimeField(auto_now_add=True)  # Data/hora de criação
    title = models.CharField(max_length=200)          # Título do post
    content = models.TextField()                      # Conteúdo do post
```

### **Características**:

- **ID**: Auto-incremento, não pode ser alterado
- **Username**: String de até 100 caracteres
- **Created Datetime**: Automático, não pode ser alterado
- **Title**: String de até 200 caracteres
- **Content**: Texto sem limite de tamanho
- **Ordenação**: Por padrão, mais recente primeiro

## 🚀 Como Executar

### **1. Configuração do Ambiente**

```bash
# Navegar para a pasta backend
cd backend

# Criar ambiente virtual
python3 -m venv venv

# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt
```

### **2. Configuração do Banco de Dados**

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Criar superusuário (opcional)
python manage.py createsuperuser
```

### **3. Executar o Servidor**

```bash
# Servidor de desenvolvimento
python manage.py runserver

# Servidor em porta específica
python manage.py runserver 8000

# Servidor acessível externamente
python manage.py runserver 0.0.0.0:8000
```

## 🌐 Acesso

- **API**: http://localhost:8000/careers/
- **Admin**: http://localhost:8000/admin/
- **Credenciais Admin**: admin / (senha definida durante criação)

## ⚠️ Configurações Importantes

### **CORS (Cross-Origin Resource Sharing)**

- Configurado para permitir todas as origens em desenvolvimento
- Para produção, configure `CORS_ALLOWED_ORIGINS` adequadamente

### **Slash Final Obrigatório**

- **IMPORTANTE**: Django requer slash final `/` em todas as URLs
- Exemplo: `/careers/` (não `/careers`)
- Isso evita problemas de CORS mencionados na especificação

### **Base URL da API**

- **Desenvolvimento**: `http://localhost:8000/careers/`
- **Produção**: `https://dev.codeleap.co.uk/careers/`

## 🔧 Configurações de Desenvolvimento

### **Settings.py**

- `DEBUG = True` para desenvolvimento
- `CORS_ALLOW_ALL_ORIGINS = True` para desenvolvimento
- `ALLOWED_HOSTS` configurado para localhost

### **Para Produção**

- Alterar `DEBUG = False`
- Configurar `CORS_ALLOWED_ORIGINS` adequadamente
- Configurar `SECRET_KEY` segura
- Configurar banco de dados de produção

## 📋 Funcionalidades Implementadas

- ✅ **Modelo Post** com todos os campos especificados
- ✅ **API REST** com todos os endpoints
- ✅ **Serializers** para validação de dados
- ✅ **CORS** configurado para frontend
- ✅ **Admin Django** para gerenciamento
- ✅ **Ordenação automática** por data de criação
- ✅ **Validação de dados** com DRF
- ✅ **Tratamento de erros** HTTP adequado

## 🧪 Testando a API

### **Com curl**

```bash
# Listar posts
curl http://localhost:8000/careers/

# Criar post
curl -X POST http://localhost:8000/careers/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","title":"Test","content":"Content"}'

# Atualizar post
curl -X PATCH http://localhost:8000/careers/1/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'

# Excluir post
curl -X DELETE http://localhost:8000/careers/1/
```

### **Com Postman/Insomnia**

- Importar as URLs acima
- Testar todos os métodos HTTP
- Verificar respostas e códigos de status

## 🤝 Integração com Frontend

O backend está configurado para integrar perfeitamente com o frontend Next.js:

- **CORS** configurado para `http://localhost:3000`
- **Endpoints** seguem exatamente o schema especificado
- **Respostas** no formato esperado pelo frontend
- **Validação** de dados com mensagens de erro claras

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.
