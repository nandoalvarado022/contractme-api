import { ConfigService } from "@nestjs/config";

/**
 * Resolves the JWT signing secret from the environment.
 *
 * Fails fast at bootstrap instead of falling back to a default: a weak or
 * shared fallback lets anyone who knows it forge tokens for any account.
 */
export const getJwtSecret = (configService: ConfigService): string => {
  const secret = configService.get<string>("JWT_SECRET");

  if (!secret || secret.trim().length === 0) {
    throw new Error(
      "JWT_SECRET is not set. Define it in the environment before starting the API.",
    );
  }

  return secret;
};
