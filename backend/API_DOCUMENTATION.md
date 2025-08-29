# API Documentation - CodeLeap Backend

## Autenticação

### Base URL

```
http://localhost:8000
```

### Endpoints de Autenticação

#### 1. Login

**POST** `/auth/login/`

Realiza login do usuário usando apenas username. Se o usuário não existir, ele é criado automaticamente.

**Request Body:**

```json
{
  "username": "string"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "date_joined": "2025-08-28T17:52:12.041698Z",
      "last_login": "2025-08-28T17:52:12.046118Z"
    },
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": {
    "username": ["Este campo é obrigatório."]
  }
}
```

#### 2. Registro

**POST** `/auth/register/`

Registra um novo usuário.

**Request Body:**

```json
{
  "username": "string"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "username": "newuser",
      "date_joined": "2025-08-28T17:52:12.041698Z",
      "last_login": null
    },
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### 3. Refresh Token

**POST** `/auth/refresh/`

Renova o token de acesso usando o token de refresh.

**Request Body:**

```json
{
  "refresh": "string"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Token renovado com sucesso",
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Token inválido ou expirado",
  "error": "Token is invalid or expired"
}
```

#### 4. Perfil do Usuário

**GET** `/auth/profile/`

Obtém informações do usuário autenticado.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser",
    "date_joined": "2025-08-28T17:52:12.041698Z",
    "last_login": "2025-08-28T17:52:12.046118Z"
  }
}
```

## Posts

### Endpoints de Posts

#### 1. Listar Posts

**GET** `/careers/`

Lista todos os posts.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "testuser",
      "created_datetime": "2025-08-28T17:52:12.041698Z",
      "title": "Meu primeiro post",
      "content": "Conteúdo do post"
    }
  ]
}
```

#### 2. Criar Post

**POST** `/careers/`

Cria um novo post.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "title": "string",
  "content": "string"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "username": "testuser",
  "created_datetime": "2025-08-28T17:52:12.041698Z",
  "title": "Meu primeiro post",
  "content": "Conteúdo do post"
}
```

#### 3. Atualizar Post

**PATCH** `/careers/{id}/`

Atualiza um post existente.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "title": "string",
  "content": "string"
}
```

#### 4. Deletar Post

**DELETE** `/careers/{id}/`

Remove um post.

**Headers:**

```
Authorization: Bearer <access_token>
```

## Configuração JWT

- **Access Token Lifetime**: 1 hora
- **Refresh Token Lifetime**: 7 dias
- **Algorithm**: HS256
- **Header Type**: Bearer

## Exemplo de Uso no Frontend

### Login

```javascript
const login = async (username) => {
  const response = await fetch("http://localhost:8000/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  const data = await response.json();

  if (data.success) {
    // Salvar tokens
    localStorage.setItem("access_token", data.data.tokens.access);
    localStorage.setItem("refresh_token", data.data.tokens.refresh);
    localStorage.setItem("user", JSON.stringify(data.data.user));
  }

  return data;
};
```

### Requisição Autenticada

```javascript
const fetchPosts = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://localhost:8000/careers/", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};
```

### Refresh Token

```javascript
const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");

  const response = await fetch("http://localhost:8000/auth/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem("access_token", data.data.access);
  }

  return data;
};
```
