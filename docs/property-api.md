# API de Propiedades Inmobiliarias - Documentación para Frontend

## Descripción General

La API de propiedades inmobiliarias permite gestionar el inventario de inmuebles disponibles en la plataforma. Incluye funcionalidades para crear, listar, actualizar y eliminar propiedades, así como agregar notas e interesados a cada propiedad.

## URL Base

```
https://api.contractme.com/properties
```

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT en el header:

```
Authorization: Bearer {token}
```

---

## Endpoints

### 1. Listar todas las propiedades

**Endpoint:** `GET /properties`

**Descripción:** Obtiene un listado de todas las propiedades inmobiliarias disponibles.

**Respuesta exitosa:**
```json
[
  {
    "id": 1,
    "city": "Soledad",
    "address": "CRA 54 # 76 12",
    "searchBy": "CRA 54 # 76 12, Barrio las moras, Soledad",
    "image": "/images/mock-apto-1.webp",
    "price": 95000000,
    "type": "Casa",
    "bedrooms": 4,
    "bathrooms": 3,
    "area": 120,
    "description": "Casa amplia con patio y garaje, ubicada cerca de centros comerciales.",
    "owner": {
      "uid": 1,
      "name": "María González",
      "phone": "3009876543",
      "email": "maria.gonzalez@example.com"
    },
    "tenant": null,
    "notes": [
      {
        "id": 1,
        "text": "El baño tiene problemas de filtros, se debe reparar antes de alquilar.",
        "date": "2023-10-01"
      }
    ],
    "interested": [
      {
        "id": 1,
        "name": "Andrés Torres",
        "phone": "3101234567",
        "email": "andres.torres@example.com"
      }
    ],
    "created_at": "2025-07-26T15:30:45.000Z",
    "updated_at": "2025-07-26T15:30:45.000Z"
  }
]
```

### 2. Obtener una propiedad por ID

**Endpoint:** `GET /properties/{id}`

**Descripción:** Obtiene los detalles completos de una propiedad específica.

**Parámetros:**
- `id` (requerido): ID de la propiedad a consultar

**Respuesta exitosa:**
```json
{
  "id": 1,
  "city": "Soledad",
  "address": "CRA 54 # 76 12",
  "searchBy": "CRA 54 # 76 12, Barrio las moras, Soledad",
  "image": "/images/mock-apto-1.webp",
  "price": 95000000,
  "type": "Casa",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 120,
  "description": "Casa amplia con patio y garaje, ubicada cerca de centros comerciales.",
  "owner": {
    "uid": 1,
    "name": "María González",
    "phone": "3009876543",
    "email": "maria.gonzalez@example.com"
  },
  "tenant": null,
  "notes": [
    {
      "id": 1,
      "text": "El baño tiene problemas de filtros, se debe reparar antes de alquilar.",
      "date": "2023-10-01"
    }
  ],
  "interested": [
    {
      "id": 1,
      "name": "Andrés Torres",
      "phone": "3101234567",
      "email": "andres.torres@example.com"
    }
  ],
  "created_at": "2025-07-26T15:30:45.000Z",
  "updated_at": "2025-07-26T15:30:45.000Z"
}
```

### 3. Crear una nueva propiedad

**Endpoint:** `POST /properties`

**Descripción:** Crea una nueva propiedad inmobiliaria.

**Cuerpo de la solicitud:**
```json
{
  "city": "Soledad",
  "address": "CRA 54 # 76 12",
  "searchBy": "CRA 54 # 76 12, Barrio las moras, Soledad",
  "image": "/images/mock-apto-1.webp",
  "price": 95000000,
  "type": "Casa",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 120,
  "description": "Casa amplia con patio y garaje, ubicada cerca de centros comerciales.",
  "owner_id": 1,
  "tenant_id": null,
  "notes": [
    {
      "text": "El baño tiene problemas de filtros, se debe reparar antes de alquilar.",
      "date": "2023-10-01"
    }
  ],
  "interested": [
    {
      "name": "Andrés Torres",
      "phone": "3101234567",
      "email": "andres.torres@example.com"
    }
  ]
}
```

**Campos obligatorios:**
- `city`: Ciudad donde se ubica la propiedad
- `address`: Dirección física de la propiedad
- `searchBy`: Texto usado para búsquedas (dirección completa y detalles)
- `price`: Precio de venta o alquiler (número)
- `type`: Tipo de propiedad (Casa, Apartamento, etc.)
- `bedrooms`: Número de habitaciones (número)
- `bathrooms`: Número de baños (número)
- `area`: Área en metros cuadrados (número)
- `description`: Descripción detallada de la propiedad
- `owner_id`: ID del usuario propietario

**Campos opcionales:**
- `image`: URL de la imagen principal de la propiedad
- `tenant_id`: ID del usuario inquilino (si existe)
- `notes`: Array de notas sobre la propiedad
- `interested`: Array de personas interesadas en la propiedad

**Respuesta exitosa:**
```json
{
  "id": 1,
  "city": "Soledad",
  "address": "CRA 54 # 76 12",
  "searchBy": "CRA 54 # 76 12, Barrio las moras, Soledad",
  "image": "/images/mock-apto-1.webp",
  "price": 95000000,
  "type": "Casa",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 120,
  "description": "Casa amplia con patio y garaje, ubicada cerca de centros comerciales.",
  "owner": {
    "uid": 1,
    "name": "María González",
    "phone": "3009876543",
    "email": "maria.gonzalez@example.com"
  },
  "tenant": null,
  "notes": [
    {
      "id": 1,
      "text": "El baño tiene problemas de filtros, se debe reparar antes de alquilar.",
      "date": "2023-10-01"
    }
  ],
  "interested": [
    {
      "id": 1,
      "name": "Andrés Torres",
      "phone": "3101234567",
      "email": "andres.torres@example.com"
    }
  ],
  "created_at": "2025-07-26T15:30:45.000Z",
  "updated_at": "2025-07-26T15:30:45.000Z"
}
```

### 4. Actualizar una propiedad

**Endpoint:** `PUT /properties/{id}`

**Descripción:** Actualiza una propiedad existente.

**Parámetros:**
- `id` (requerido): ID de la propiedad a actualizar

**Cuerpo de la solicitud:**
```json
{
  "price": 98000000,
  "description": "Casa amplia con patio y garaje, ubicada cerca de centros comerciales y parques.",
  "notes": [
    {
      "text": "El baño tiene problemas de filtros, se debe reparar antes de alquilar.",
      "date": "2023-10-01"
    },
    {
      "text": "Se pintó la fachada recientemente.",
      "date": "2023-11-15"
    }
  ]
}
```

**Nota:** Solo se requiere enviar los campos que deseas actualizar.

**Respuesta exitosa:**
```json
{
  "id": 1,
  "city": "Soledad",
  "address": "CRA 54 # 76 12",
  "searchBy": "CRA 54 # 76 12, Barrio las moras, Soledad",
  "image": "/images/mock-apto-1.webp",
  "price": 98000000,
  "type": "Casa",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 120,
  "description": "Casa amplia con patio y garaje, ubicada cerca de centros comerciales y parques.",
  "owner": {
    "uid": 1,
    "name": "María González",
    "phone": "3009876543",
    "email": "maria.gonzalez@example.com"
  },
  "tenant": null,
  "notes": [
    {
      "id": 1,
      "text": "El baño tiene problemas de filtros, se debe reparar antes de alquilar.",
      "date": "2023-10-01"
    },
    {
      "id": 2,
      "text": "Se pintó la fachada recientemente.",
      "date": "2023-11-15"
    }
  ],
  "interested": [
    {
      "id": 1,
      "name": "Andrés Torres",
      "phone": "3101234567",
      "email": "andres.torres@example.com"
    }
  ],
  "created_at": "2025-07-26T15:30:45.000Z",
  "updated_at": "2025-07-27T10:15:30.000Z"
}
```

### 5. Eliminar una propiedad

**Endpoint:** `DELETE /properties/{id}`

**Descripción:** Elimina una propiedad existente.

**Parámetros:**
- `id` (requerido): ID de la propiedad a eliminar

**Respuesta exitosa:**
```json
{
  "message": "Propiedad eliminada correctamente"
}
```

### 6. Obtener propiedades por propietario

**Endpoint:** `GET /properties/owner/{ownerId}`

**Descripción:** Obtiene todas las propiedades asociadas a un propietario específico.

**Parámetros:**
- `ownerId` (requerido): ID del usuario propietario

**Respuesta exitosa:**
```json
[
  {
    "id": 1,
    "city": "Soledad",
    "address": "CRA 54 # 76 12",
    "searchBy": "CRA 54 # 76 12, Barrio las moras, Soledad",
    "image": "/images/mock-apto-1.webp",
    "price": 95000000,
    "type": "Casa",
    "bedrooms": 4,
    "bathrooms": 3,
    "area": 120,
    "description": "Casa amplia con patio y garaje, ubicada cerca de centros comerciales.",
    "owner": {
      "uid": 1,
      "name": "María González",
      "phone": "3009876543",
      "email": "maria.gonzalez@example.com"
    },
    "tenant": null,
    "notes": [...],
    "interested": [...],
    "created_at": "2025-07-26T15:30:45.000Z",
    "updated_at": "2025-07-26T15:30:45.000Z"
  },
  {
    "id": 2,
    // Datos de otra propiedad
  }
]
```

### 7. Obtener propiedades por inquilino

**Endpoint:** `GET /properties/tenant/{tenantId}`

**Descripción:** Obtiene todas las propiedades asociadas a un inquilino específico.

**Parámetros:**
- `tenantId` (requerido): ID del usuario inquilino

**Respuesta exitosa:** Similar a la respuesta de propiedades por propietario.

### 8. Agregar una nota a una propiedad

**Endpoint:** `POST /properties/{id}/notes`

**Descripción:** Agrega una nueva nota a una propiedad existente.

**Parámetros:**
- `id` (requerido): ID de la propiedad

**Cuerpo de la solicitud:**
```json
{
  "text": "Se realizó revisión de la instalación eléctrica.",
  "date": "2023-12-20"
}
```

**Respuesta exitosa:**
```json
{
  "id": 3,
  "text": "Se realizó revisión de la instalación eléctrica.",
  "date": "2023-12-20",
  "property_id": 1,
  "created_at": "2025-07-27T11:20:15.000Z",
  "updated_at": "2025-07-27T11:20:15.000Z"
}
```

### 9. Agregar un interesado a una propiedad

**Endpoint:** `POST /properties/{id}/interested`

**Descripción:** Registra una nueva persona interesada en una propiedad.

**Parámetros:**
- `id` (requerido): ID de la propiedad

**Cuerpo de la solicitud:**
```json
{
  "name": "Diana Alvarado",
  "phone": "3101234567",
  "email": "diana.alvarado@example.com",
  "user_id": 5
}
```

**Campos obligatorios:**
- `name`: Nombre del interesado
- `phone`: Número de teléfono del interesado
- `email`: Correo electrónico del interesado

**Campos opcionales:**
- `user_id`: ID del usuario si ya está registrado en el sistema

**Respuesta exitosa:**
```json
{
  "id": 2,
  "name": "Diana Alvarado",
  "phone": "3101234567",
  "email": "diana.alvarado@example.com",
  "user_id": 5,
  "property_id": 1,
  "created_at": "2025-07-27T11:25:30.000Z",
  "updated_at": "2025-07-27T11:25:30.000Z"
}
```

## Modelos de Datos

### Propiedad (Property)

```typescript
{
  id: number;
  city: string;
  address: string;
  searchBy: string;
  image: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  owner: User;
  owner_id: number;
  tenant: User | null;
  tenant_id: number | null;
  notes: PropertyNote[];
  interested: PropertyInterested[];
  created_at: Date;
  updated_at: Date;
}
```

### Nota de Propiedad (PropertyNote)

```typescript
{
  id: number;
  text: string;
  date: Date;
  property: Property;
  property_id: number;
  created_at: Date;
  updated_at: Date;
}
```

### Interesado en Propiedad (PropertyInterested)

```typescript
{
  id: number;
  name: string;
  phone: string;
  email: string;
  property: Property;
  property_id: number;
  user: User | null;
  user_id: number | null;
  created_at: Date;
  updated_at: Date;
}
```

## Códigos de Estado HTTP

- `200 OK`: La solicitud se ha completado exitosamente
- `201 Created`: El recurso se ha creado exitosamente
- `400 Bad Request`: Solicitud incorrecta (validación fallida)
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor
