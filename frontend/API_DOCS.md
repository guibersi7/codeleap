# API Documentation - CodeLeap Network

## Base URL

```
http://localhost:8000
```

## Endpoints

### Posts

#### GET /api/posts/

Retorna a lista de todos os posts.

**Response:**

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

#### POST /api/posts/

Cria um novo post.

**Request Body:**

```json
{
  "username": "john_doe",
  "title": "Hello World",
  "content": "This is my first post!"
}
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "created_datetime": "2024-01-15T10:30:00Z",
    "title": "Hello World",
    "content": "This is my first post!"
  }
}
```

#### PATCH /api/posts/{id}/

Atualiza um post existente.

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "created_datetime": "2024-01-15T10:30:00Z",
    "title": "Updated Title",
    "content": "Updated content"
  }
}
```

#### DELETE /api/posts/{id}/

Remove um post.

**Response:**

```json
{
  "message": "Post deleted successfully"
}
```

## Data Models

### Post Schema

```typescript
interface Post {
  id: number; // ID único do post
  username: string; // Nome do usuário que criou o post
  created_datetime: string; // Data e hora de criação (ISO 8601)
  title: string; // Título do post
  content: string; // Conteúdo do post
}
```

### Create Post Data

```typescript
interface CreatePostData {
  username: string; // Nome do usuário
  title: string; // Título do post
  content: string; // Conteúdo do post
}
```

### Update Post Data

```typescript
interface UpdatePostData {
  title: string; // Novo título (opcional)
  content: string; // Novo conteúdo (opcional)
}
```

## Error Handling

A API retorna códigos de status HTTP padrão:

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **404** - Post não encontrado
- **500** - Erro interno do servidor

**Error Response:**

```json
{
  "error": "Error message description"
}
```

## Environment Variables

Configure as seguintes variáveis de ambiente:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development
NODE_ENV=development
```

## Notes

- Todos os endpoints retornam JSON
- Datas são no formato ISO 8601
- IDs são números inteiros únicos
- Username é uma string que identifica o usuário
- Título e conteúdo são obrigatórios para criação
- Para edição, pelo menos um campo deve ser fornecido
