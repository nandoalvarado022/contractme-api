# 👥 Módulo de Usuarios - Documentación Completa

Esta documentación está dirigida al equipo de Frontend para entender e implementar correctamente el módulo de usuarios de ContractMe API.

## 📋 **Índice**

1. [Visión General](#visión-general)
2. [Estructura de Datos](#estructura-de-datos)
3. [Endpoints Disponibles](#endpoints-disponibles)
4. [Relaciones con Otros Módulos](#relaciones-con-otros-módulos)
5. [Ejemplos de Implementación](#ejemplos-de-implementación)
6. [Validaciones y Reglas de Negocio](#validaciones-y-reglas-de-negocio)
7. [Manejo de Errores](#manejo-de-errores)
8. [Casos de Uso Frontend](#casos-de-uso-frontend)

---

## 🎯 **Visión General**

El módulo de usuarios es el núcleo del sistema ContractMe. Maneja la información personal, profesional y referencias de los usuarios, integrándose automáticamente con los módulos de:

- **Education** (Formación académica)
- **Experience** (Experiencia laboral)
- **Reference** (Referencias personales/profesionales)
- **Audit Logs** (Trazabilidad de cambios)

### **Características Principales:**
- ✅ Creación y gestión completa de usuarios
- ✅ Relaciones automáticas con módulos relacionados
- ✅ Validación robusta de datos
- ✅ Contraseñas hasheadas automáticamente
- ✅ Audit trail completo
- ✅ Soft delete (eliminación lógica)

---

## 📊 **Estructura de Datos**

### **Usuario Base (UserEntity)**

```typescript
{
  uid: number,                    // ID único del usuario
  name: string,                   // Nombre principal
  email: string,                  // Email único
  password: string,               // Contraseña hasheada
  phone: string,                  // Teléfono
  document_type: DocumentType,    // Tipo de documento
  document_number: number,        // Número de documento
  picture: string,                // URL de la foto
  birth_date: string,             // Fecha de nacimiento
  role: Role,                     // Rol del usuario
  created_at: Date,               // Fecha de creación
  deleted_at?: Date,              // Fecha de eliminación (soft delete)
  
  // Relaciones
  education: EducationEntity[],   // Formación académica
  experience: ExperienceEntity[], // Experiencia laboral
  reference: ReferenceEntity[],   // Referencias
  logs: AuditLogsEntity[]         // Logs de auditoría
}
```

### **Enumeraciones**

#### **DocumentType**
```typescript
enum DocumentType {
  CC = 'cc',    // Cédula de Ciudadanía
  NIT = 'nit',  // Número de Identificación Tributaria
  TI = 'ti',    // Tarjeta de Identidad
  CE = 'ce'     // Cédula de Extranjería
}
```

#### **Role**
```typescript
enum Role {
  USER = 'user',    // Usuario estándar
  ADMIN = 'admin'   // Administrador
}
```

### **Education (Formación Académica)**

```typescript
{
  id: number,
  place: string,        // Institución educativa
  title: string,        // Título o programa
  start_date: string,   // Fecha de inicio (YYYY-MM-DD)
  end_date?: string,    // Fecha de finalización (opcional)
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date,
  uid: number          // Relación con el usuario
}
```

### **Experience (Experiencia Laboral)**

```typescript
{
  id: number,
  company: string,      // Empresa
  position: string,     // Cargo
  start_date: string,   // Fecha de inicio (YYYY-MM-DD)
  end_date?: string,    // Fecha de finalización (opcional)
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date,
  uid: number          // Relación con el usuario
}
```

### **Reference (Referencias)**

```typescript
{
  id: number,
  name: string,         // Nombre de la referencia
  phone?: string,       // Teléfono (opcional)
  relationship: string, // Tipo de relación
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date,
  uid: number          // Relación con el usuario
}
```

---

## 🚀 **Endpoints Disponibles**

### **Base URL:** `/users`

#### **1. Obtener Todos los Usuarios**
```http
GET /users
```

**Respuesta:**
```json
{
  "data": [
    {
      "uid": 1,
      "name": "Juan Carlos",
      "email": "juan.perez@email.com",
      "phone": "3001234567",
      "document_type": "cc",
      "document_number": 12345678,
      "picture": "/images/users/juan-perez.jpg",
      "birth_date": "1990-05-15",
      "role": "user",
      "created_at": "2024-08-23T10:30:00Z"
    }
  ],
  "total": 1,
  "message": "Users retrieved successfully",
  "statusCode": 200
}
```

#### **2. Obtener Usuario por ID**
```http
GET /users/:uid
```

**Parámetros:**
- `uid` (number): ID del usuario

**Respuesta:**
```json
{
  "data": {
    "uid": 1,
    "name": "Juan Carlos",
    "email": "juan.perez@email.com",
    "phone": "3001234567",
    "document_type": "cc",
    "document_number": 12345678,
    "picture": "/images/users/juan-perez.jpg",
    "birth_date": "1990-05-15",
    "role": "user"
  },
  "message": "User retrieved successfully",
  "statusCode": 200
}
```

#### **3. Crear Usuario Completo**
```http
POST /users/create
```

**Body (CreateUserDto):**
```json
{
  "name": "Juan Carlos",
  "email": "juan.perez@email.com",
  "password": "temporal123",
  "phone": "3001234567",
  "document_type": "cc",
  "document_number": 12345678,
  "picture": "/images/users/juan-perez.jpg",
  "birth_date": "1990-05-15",
  "role": "user",
  "education": [
    {
      "place": "Universidad Nacional de Colombia",
      "title": "Ingeniería de Sistemas",
      "start_date": "2008-02-01",
      "end_date": "2013-12-15"
    }
  ],
  "experience": [
    {
      "company": "TechCorp Solutions",
      "position": "Desarrollador Full Stack Senior",
      "start_date": "2020-03-01",
      "end_date": "2024-08-20"
    }
  ],
  "reference": [
    {
      "name": "María González",
      "phone": "3109876543",
      "relationship": "Jefe Directo - TechCorp"
    }
  ]
}
```

**Respuesta:**
```json
{
  "data": {
    "uid": 1,
    "name": "Juan Carlos",
    "email": "juan.perez@email.com",
    "created_at": "2024-08-23T10:30:00Z"
  },
  "message": "Usuario guardado con éxito",
  "status": "success",
  "statusCode": 201
}
```

#### **4. Actualizar Usuario**
```http
PUT /users/edit/:id
```

**Parámetros:**
- `id` (number): ID del usuario

**Body (UpdateUserDto):**
```json
{
  "name": "Juan Carlos",
  "phone": "3001234567",
  "education": [
    {
      "place": "Universidad Javeriana",
      "title": "Maestría en Ingeniería de Software",
      "start_date": "2014-02-01",
      "end_date": "2016-12-15"
    }
  ],
  "experience": [
    {
      "company": "Google",
      "position": "Senior Software Engineer",
      "start_date": "2024-09-01"
    }
  ]
}
```

**Respuesta:**
```json
{
  "data": {
    "uid": 1,
    "name": "Juan Carlos",
  },
  "message": "Usuario editado con éxito",
  "status": "success",
  "statusCode": 200
}
```

#### **5. Registro de Usuario (Auth)**
```http
POST /users/auth/register
```

**Body (RegisterDto):**
```json
{
  "name": "Ana María",
  "email": "ana.maria@email.com",
  "password": "miPassword123"
}
```

---

## 🔗 **Relaciones con Otros Módulos**

### **1. Education Module**

**Endpoints relacionados:**
- `GET /education/user/:uid` - Obtener educación de un usuario
- `POST /education` - Crear nueva educación
- `PUT /education/:id` - Actualizar educación
- `DELETE /education/:id` - Eliminar educación

**Integración automática:**
- Al crear/actualizar usuario con array `education`, se crean/actualizan automáticamente
- Relación CASCADE: eliminar usuario → elimina sus educaciones
- Cada educación tiene referencia `uid` al usuario

### **2. Experience Module**

**Endpoints relacionados:**
- `GET /experience/user/:uid` - Obtener experiencia de un usuario
- `POST /experience` - Crear nueva experiencia
- `PUT /experience/:id` - Actualizar experiencia
- `DELETE /experience/:id` - Eliminar experiencia

**Integración automática:**
- Al crear/actualizar usuario con array `experience`, se crean/actualizan automáticamente
- Relación CASCADE: eliminar usuario → elimina sus experiencias
- Cada experiencia tiene referencia `uid` al usuario

### **3. Reference Module**

**Endpoints relacionados:**
- `GET /reference/user/:uid` - Obtener referencias de un usuario
- `POST /reference` - Crear nueva referencia
- `PUT /reference/:id` - Actualizar referencia
- `DELETE /reference/:id` - Eliminar referencia

**Integración automática:**
- Al crear/actualizar usuario con array `reference`, se crean/actualizan automáticamente
- Relación CASCADE: eliminar usuario → elimina sus referencias
- Cada referencia tiene referencia `uid` al usuario

### **4. Audit Logs**

**Seguimiento automático:**
- Cada creación de usuario genera log de auditoría
- Cada actualización de usuario genera log de auditoría
- Los logs incluyen datos sensibles filtrados (sin contraseñas)

---

## ✅ **Validaciones y Reglas de Negocio**

### **Validaciones de Campos**

| Campo | Tipo | Validación | Requerido |
|-------|------|------------|-----------|
| `name` | string | No vacío | ✅ |
| `email` | string | Email válido, único | ✅ |
| `password` | string | No vacío (se hashea automáticamente) | ✅ |
| `phone` | string | No vacío | ✅ |
| `document_type` | enum | 'cc', 'nit', 'ti', 'ce' | ✅ |
| `document_number` | number | Número válido | ✅ |
| `picture` | string | URL válida | ✅ |
| `birth_date` | string | Formato YYYY-MM-DD | ✅ |
| `role` | enum | 'user', 'admin' | ✅ |
| `education` | array | Array de objetos válidos | ❌ |
| `experience` | array | Array de objetos válidos | ❌ |
| `reference` | array | Array de objetos válidos | ❌ |

### **Reglas de Negocio**

1. **Contraseña Automática**: Al crear usuarios, la contraseña se reemplaza automáticamente por "contractme" hasheada
2. **Email Único**: No pueden existir dos usuarios con el mismo email
3. **Relaciones Automáticas**: Al incluir arrays de education/experience/reference, se crean automáticamente
4. **Eliminación CASCADE**: Eliminar usuario elimina automáticamente sus relaciones
5. **Audit Trail**: Todas las operaciones se registran en logs de auditoría
6. **Soft Delete**: Las eliminaciones son lógicas (deleted_at)

### **Validaciones de Fechas**

- Formato aceptado: `YYYY-MM-DD` o ISO 8601
- `start_date` es obligatorio en education/experience
- `end_date` es opcional (para trabajos/estudios actuales)

---

## ⚠️ **Manejo de Errores**

### **Códigos de Error Comunes**

| Código | Descripción | Causa |
|--------|-------------|-------|
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Token JWT inválido |
| 404 | Not Found | Usuario no encontrado |
| 409 | Conflict | Email ya existe |
| 422 | Validation Error | Falla en validación de DTOs |
| 500 | Server Error | Error interno del servidor |

### **Formato de Respuesta de Error**

```json
{
  "status": "error",
  "message": "Descripción del error",
  "statusCode": 400,
  "details": {
    "field": "email",
    "error": "Email already exists"
  }
}
```
---

## 🔧 **Configuración y Consideraciones Técnicas**

### **Headers Requeridos**

```javascript
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
};
```
---

**Última actualización**: Agosto 23, 2025  
**Versión**: 1.0.0
