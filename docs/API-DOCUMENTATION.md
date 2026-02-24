# ContractMe API - Documentación Completa

Esta es la documentación completa de todos los endpoints disponibles en la API de ContractMe.

## Formato de Respuesta Estándar

Todas las respuestas de la API siguen el siguiente formato:

```json
{
  "data": {
    // Datos específicos del endpoint
  },
  "message": "Mensaje descriptivo de la operación",
  "statusCode": 200
}
```

## Endpoints Disponibles

### 1. App Module (Sistema)

#### Verificar Estado del Sistema
- **GET** `/`
- **Descripción**: Endpoint básico para verificar que la API está funcionando
- **Respuesta**:
```json
{
  "data": "Hello World!",
  "message": "API is running",
  "statusCode": 200
}
```

#### Obtener Logs de Auditoría
- **GET** `/logs`
- **Descripción**: Obtiene todos los logs de auditoría del sistema
- **Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "action": "LOGIN",
      "details": "User logged in",
      "timestamp": "2024-01-15T10:30:00Z",
      "user_id": 123
    }
  ],
  "message": "Audit logs retrieved successfully",
  "statusCode": 200
}
```

---

### 2. Auth Module (Autenticación)

#### Registrar Usuario
- **POST** `/auth/register`
- **Descripción**: Registra un nuevo usuario en el sistema
- **Body**:
```json
{
  "email": "usuario@email.com",
  "password": "password123",
  "firstName": "Juan",
  "lastname": "Pérez"
}
```
- **Respuesta**:
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@email.com",
      "firstName": "Juan",
      "lastname": "Pérez"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully",
  "statusCode": 201
}
```

#### Iniciar Sesión
- **POST** `/auth/login`
- **Descripción**: Autentica un usuario y devuelve un token JWT
- **Body**:
```json
{
  "email": "usuario@email.com",
  "password": "password123"
}
```
- **Respuesta**:
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@email.com",
      "firstName": "Juan",
      "lastname": "Pérez"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful",
  "statusCode": 200
}
```

---

### 3. User Module (Usuarios)

#### Obtener Todos los Usuarios
- **GET** `/users`
- **Descripción**: Obtiene la lista de todos los usuarios
- **Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "email": "usuario@email.com",
      "firstName": "Juan",
      "lastname": "Pérez",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "message": "Users retrieved successfully",
  "statusCode": 200
}
```

#### Obtener Usuario por ID
- **GET** `/users/:id`
- **Descripción**: Obtiene los detalles de un usuario específico
- **Parámetros**:
  - `id` (number): ID del usuario
- **Respuesta**:
```json
{
  "data": {
    "id": 1,
    "email": "usuario@email.com",
    "firstName": "Juan",
    "lastname": "Pérez",
    "createdAt": "2024-01-15T10:30:00Z",
    "education": [...],
    "experience": [...]
  },
  "message": "User retrieved successfully",
  "statusCode": 200
}
```

#### Crear Usuario
- **POST** `/users`
- **Descripción**: Crea un nuevo usuario
- **Body**:
```json
{
  "email": "nuevo@email.com",
  "firstName": "Ana",
  "lastname": "García",
  "password": "password123"
}
```
- **Respuesta**:
```json
{
  "data": {
    "id": 2,
    "email": "nuevo@email.com",
    "firstName": "Ana",
    "lastname": "García",
    "createdAt": "2024-01-15T11:00:00Z"
  },
  "message": "User created successfully",
  "statusCode": 201
}
```

#### Actualizar Usuario
- **PATCH** `/users/:id`
- **Descripción**: Actualiza los datos de un usuario existente
- **Parámetros**:
  - `id` (number): ID del usuario
- **Body**:
```json
{
  "firstName": "Ana María",
  "lastname": "García López"
}
```
- **Respuesta**:
```json
{
  "data": {
    "id": 2,
    "email": "nuevo@email.com",
    "firstName": "Ana María",
    "lastname": "García López",
    "updatedAt": "2024-01-15T11:30:00Z"
  },
  "message": "User updated successfully",
  "statusCode": 200
}
```

#### Eliminar Usuario
- **DELETE** `/users/:id`
- **Descripción**: Elimina un usuario del sistema
- **Parámetros**:
  - `id` (number): ID del usuario
- **Respuesta**:
```json
{
  "data": {
    "deleted": true,
    "id": 2
  },
  "message": "User deleted successfully",
  "statusCode": 200
}
```

---

### 4. Property Module (Propiedades)

#### Obtener Todas las Propiedades
- **GET** `/properties`
- **Descripción**: Obtiene la lista de todas las propiedades
- **Query Parameters** (opcionales):
  - `take` (number): Número de elementos a obtener (paginación)
  - `skip` (number): Número de elementos a saltar (paginación)
- **Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Casa en el Centro",
      "description": "Hermosa casa de 3 habitaciones",
      "price": 250000,
      "location": "Centro, Ciudad",
      "bedrooms": 3,
      "bathrooms": 2,
      "squareMeters": 150,
      "propertyType": "casa",
      "isAvailable": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "message": "Properties retrieved successfully",
  "statusCode": 200
}
```

#### Obtener Propiedad por ID
- **GET** `/properties/:id`
- **Descripción**: Obtiene los detalles de una propiedad específica
- **Parámetros**:
  - `id` (number): ID de la propiedad
- **Respuesta**:
```json
{
  "data": {
    "id": 1,
    "title": "Casa en el Centro",
    "description": "Hermosa casa de 3 habitaciones",
    "price": 250000,
    "location": "Centro, Ciudad",
    "bedrooms": 3,
    "bathrooms": 2,
    "squareMeters": 150,
    "propertyType": "casa",
    "isAvailable": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "notes": [...],
    "interestedParties": [...]
  },
  "message": "Property retrieved successfully",
  "statusCode": 200
}
```

#### Crear Propiedad
- **POST** `/properties`
- **Descripción**: Crea una nueva propiedad
- **Body**:
```json
{
  "title": "Departamento Moderno",
  "description": "Departamento de 2 habitaciones con vista al mar",
  "price": 180000,
  "location": "Zona Costera",
  "bedrooms": 2,
  "bathrooms": 1,
  "squareMeters": 85,
  "propertyType": "apartamento",
  "isAvailable": true
}
```
- **Respuesta**:
```json
{
  "data": {
    "id": 2,
    "title": "Departamento Moderno",
    "description": "Departamento de 2 habitaciones con vista al mar",
    "price": 180000,
    "location": "Zona Costera",
    "bedrooms": 2,
    "bathrooms": 1,
    "squareMeters": 85,
    "propertyType": "apartamento",
    "isAvailable": true,
    "createdAt": "2024-01-15T12:00:00Z"
  },
  "message": "Property created successfully",
  "statusCode": 201
}
```

#### Actualizar Propiedad
- **PATCH** `/properties/:id`
- **Descripción**: Actualiza los datos de una propiedad existente
- **Parámetros**:
  - `id` (number): ID de la propiedad
- **Body**:
```json
{
  "price": 175000,
  "isAvailable": false
}
```
- **Respuesta**:
```json
{
  "data": {
    "id": 2,
    "title": "Departamento Moderno",
    "price": 175000,
    "isAvailable": false,
    "updatedAt": "2024-01-15T13:00:00Z"
  },
  "message": "Property updated successfully",
  "statusCode": 200
}
```

#### Eliminar Propiedad
- **DELETE** `/properties/:id`
- **Descripción**: Elimina una propiedad del sistema
- **Parámetros**:
  - `id` (number): ID de la propiedad
- **Respuesta**:
```json
{
  "data": {
    "deleted": true,
    "id": 2
  },
  "message": "Property deleted successfully",
  "statusCode": 200
}
```

#### Gestión de Notas de Propiedades

##### Obtener Notas de una Propiedad
- **GET** `/properties/:propertyId/notes`
- **Descripción**: Obtiene todas las notas de una propiedad específica
- **Parámetros**:
  - `propertyId` (number): ID de la propiedad
- **Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "note": "Cliente muy interesado, llamar mañana",
      "createdAt": "2024-01-15T14:00:00Z",
      "propertyId": 1
    }
  ],
  "message": "Property notes retrieved successfully",
  "statusCode": 200
}
```

##### Crear Nota para Propiedad
- **POST** `/properties/:propertyId/notes`
- **Descripción**: Crea una nueva nota para una propiedad
- **Parámetros**:
  - `propertyId` (number): ID de la propiedad
- **Body**:
```json
{
  "note": "Revisión técnica programada para el viernes"
}
```
- **Respuesta**:
```json
{
  "data": {
    "id": 2,
    "note": "Revisión técnica programada para el viernes",
    "createdAt": "2024-01-15T15:00:00Z",
    "propertyId": 1
  },
  "message": "Note created successfully",
  "statusCode": 201
}
```

##### Actualizar Nota
- **PATCH** `/properties/notes/:noteId`
- **Descripción**: Actualiza una nota existente
- **Parámetros**:
  - `noteId` (number): ID de la nota
- **Body**:
```json
{
  "note": "Revisión técnica completada - todo en orden"
}
```
- **Respuesta**:
```json
{
  "data": {
    "id": 2,
    "note": "Revisión técnica completada - todo en orden",
    "updatedAt": "2024-01-15T16:00:00Z"
  },
  "message": "Note updated successfully",
  "statusCode": 200
}
```

##### Eliminar Nota
- **DELETE** `/properties/notes/:noteId`
- **Descripción**: Elimina una nota
- **Parámetros**:
  - `noteId` (number): ID de la nota
- **Respuesta**:
```json
{
  "data": {
    "deleted": true,
    "id": 2
  },
  "message": "Note deleted successfully",
  "statusCode": 200
}
```

#### Gestión de Interesados en Propiedades

##### Obtener Interesados de una Propiedad
- **GET** `/properties/:propertyId/interested`
- **Descripción**: Obtiene todos los interesados en una propiedad específica
- **Parámetros**:
  - `propertyId` (number): ID de la propiedad
- **Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Carlos Mendoza",
      "email": "carlos@email.com",
      "phone": "+1234567890",
      "createdAt": "2024-01-15T10:00:00Z",
      "propertyId": 1
    }
  ],
  "message": "Interested parties retrieved successfully",
  "statusCode": 200
}
```

##### Agregar Interesado a Propiedad
- **POST** `/properties/:propertyId/interested`
- **Descripción**: Agrega un nuevo interesado a una propiedad
- **Parámetros**:
  - `propertyId` (number): ID de la propiedad
- **Body**:
```json
{
  "name": "María López",
  "email": "maria@email.com",
  "phone": "+0987654321"
}
```
- **Respuesta**:
```json
{
  "data": {
    "id": 2,
    "name": "María López",
    "email": "maria@email.com",
    "phone": "+0987654321",
    "createdAt": "2024-01-15T11:00:00Z",
    "propertyId": 1
  },
  "message": "Interested party added successfully",
  "statusCode": 201
}
```

##### Eliminar Interesado
- **DELETE** `/properties/interested/:interestedId`
- **Descripción**: Elimina un interesado de una propiedad
- **Parámetros**:
  - `interestedId` (number): ID del interesado
- **Respuesta**:
```json
{
  "data": {
    "deleted": true,
    "id": 2
  },
  "message": "Interested party removed successfully",
  "statusCode": 200
}
```

---

### 5. Education Module (Educación)

#### Obtener Educación por Usuario
- **GET** `/education/:uid`
- **Descripción**: Obtiene todos los registros educativos de un usuario específico
- **Parámetros**:
  - `uid` (number): ID del usuario
- **Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "institution": "Universidad Nacional",
      "degree": "Licenciatura en Ingeniería de Sistemas",
      "fieldOfStudy": "Informática",
      "startDate": "2018-03-01",
      "endDate": "2022-12-15",
      "isCurrentlyStudying": false,
      "description": "Enfoque en desarrollo de software y bases de datos",
      "user_id": 123
    }
  ],
  "message": "Education records retrieved successfully",
  "statusCode": 200
}
```

---

### 6. Experience Module (Experiencia)

#### Obtener Experiencia por Usuario
- **GET** `/experience/:id`
- **Descripción**: Obtiene todos los registros de experiencia laboral de un usuario específico
- **Parámetros**:
  - `id` (number): ID del usuario
- **Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "company": "TechCorp Solutions",
      "position": "Desarrollador Full Stack",
      "startDate": "2022-01-15",
      "endDate": "2024-01-10",
      "isCurrentlyWorking": false,
      "description": "Desarrollo de aplicaciones web con React y Node.js",
      "user_id": 123
    }
  ],
  "message": "Experience records retrieved successfully",
  "statusCode": 200
}
```

---

### 7. AI Module (Inteligencia Artificial)

#### Consultar Archivo con IA
- **GET** `/ai/query-file`
- **Descripción**: Realiza una consulta a un archivo usando inteligencia artificial
- **Query Parameters**:
  - `file` (string): Nombre o ruta del archivo a consultar
  - `query` (string): Pregunta o consulta a realizar sobre el archivo
- **Ejemplo**: `/ai/query-file?file=documento.pdf&query=¿Cuál es el resumen del documento?`
- **Respuesta**:
```json
{
  "data": {
    "query": "¿Cuál es el resumen del documento?",
    "file": "documento.pdf",
    "response": "El documento contiene información sobre..."
  },
  "message": "AI response generated successfully",
  "statusCode": 200
}
```

---

### 8. Contract Module (Contratos)

#### Obtener Todos los Contratos
- **GET** `/contracts`
- **Descripción**: Obtiene la lista de todos los contratos
- **Parámetros**:
  - `uid` (number): ID del usuario (parámetro de ruta)
- **Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Contrato de Arrendamiento",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00Z",
      "user_id": 123
    }
  ],
  "message": "Contracts retrieved successfully",
  "statusCode": 200
}
```

#### Obtener Plantillas de Contratos
- **GET** `/contracts/templates/:id?`
- **Descripción**: Obtiene las plantillas de contratos disponibles
- **Parámetros**:
  - `id` (number, opcional): ID de una plantilla específica
- **Respuesta** (sin ID específico):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Plantilla de Arrendamiento Residencial",
      "description": "Plantilla estándar para contratos de arrendamiento",
      "fields": [...],
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "message": "Contract templates retrieved successfully",
  "statusCode": 200
}
```

**Respuesta** (con ID específico):
```json
{
  "data": {
    "id": 1,
    "name": "Plantilla de Arrendamiento Residencial",
    "description": "Plantilla estándar para contratos de arrendamiento",
    "fields": [
      {
        "id": 1,
        "fieldName": "tenant_name",
        "fieldType": "text",
        "isRequired": true,
        "label": "Nombre del Inquilino"
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "message": "Contract template retrieved successfully",
  "statusCode": 200
}
```

---

## Códigos de Estado HTTP

La API utiliza los siguientes códigos de estado:

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error en la solicitud (datos inválidos)
- **401 Unauthorized**: No autorizado (token inválido o expirado)
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Autenticación

La mayoría de los endpoints requieren autenticación JWT. Incluye el token en el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Validación de Datos

Todos los endpoints que reciben datos en el body validan la información usando DTOs (Data Transfer Objects) con las siguientes reglas comunes:

- **Email**: Debe ser un email válido
- **Campos requeridos**: No pueden estar vacíos
- **Tipos de datos**: Deben coincidir con el tipo esperado (string, number, boolean)
- **Longitud**: Algunos campos tienen límites de caracteres

## Paginación

Los endpoints que devuelven listas soportan paginación con los siguientes parámetros:

- `take`: Número de elementos a devolver (por defecto: 10)
- `skip`: Número de elementos a saltar (por defecto: 0)

Ejemplo: `/properties?take=20&skip=40`

---

## Información Adicional

### Base URL
La URL base de la API es configurable según el entorno:
- **Desarrollo**: `http://localhost:3000`
- **Producción**: `https://api.contractme.com`

### Rate Limiting
La API implementa límites de velocidad para prevenir abuso. Los límites específicos dependen del endpoint y el plan de suscripción.

### Logs de Auditoría
Todas las acciones importantes se registran en el sistema de auditoría, incluyendo:
- Inicio de sesión de usuarios
- Creación, actualización y eliminación de recursos
- Accesos a datos sensibles

### Soporte
Para soporte técnico o preguntas sobre la API, contacta al equipo de desarrollo.
