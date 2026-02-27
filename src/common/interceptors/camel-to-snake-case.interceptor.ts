import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Convierte una cadena de camelCase a snake_case
 * @param str - Cadena en camelCase
 * @returns Cadena en snake_case
 */
function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convierte recursivamente las claves de un objeto de camelCase a snake_case
 * @param obj - Objeto a convertir
 * @returns Nuevo objeto con claves en snake_case
 */
function transformKeysToSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeysToSnakeCase(item));
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const newObj: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = camelToSnakeCase(key);
      const value = obj[key];

      // Recursivamente transformar valores que sean objetos
      if (typeof value === 'object' && value !== null) {
        newObj[snakeKey] = transformKeysToSnakeCase(value);
      } else {
        newObj[snakeKey] = value;
      }
    }
  }

  return newObj;
}

/**
 * Interceptor que transforma el body de las peticiones de camelCase a snake_case
 * Útil para normalizar los datos enviados por el cliente antes de procesarlos
 */
@Injectable()
export class CamelToSnakeCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Transformar el body si existe
    if (request.body && typeof request.body === 'object') {
      request.body = transformKeysToSnakeCase(request.body);
    }

    return next.handle();
  }
}
