import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const uid = req.headers["uid"];
    if (
      (uid && !isNaN(Number(uid)) && typeof uid === "number") ||
      typeof uid === "string"
    ) {
      req["uid"] = Number(uid);
    }
    next();
  }
}
