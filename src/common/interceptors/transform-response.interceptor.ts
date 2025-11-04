import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Reflector } from "@nestjs/core";
import { RESPONSE_MESSAGE } from "../decorators/response-message.decorator";

export interface Response<T> {
  data: T;
  message?: string;
  status: string;
  path: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector = new Reflector()) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Obtener mensaje personalizado si existe
    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === "object" && data.hasOwnProperty("data")) {
          return {
            ...data,
            status: data.status || "success",
            message: message || data.message,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        return {
          data,
          status: "success",
          ...(message && { message }),
          path: request.url,
        };
      }),
    );
  }
}
