import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common/exceptions";

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request["uid"]) {
      throw new NotFoundException("User ID not found in request");
    }
    return request["uid"];
  },
);
