// sessionRedis.ts
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

export function createRedisStore() {
  const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  client.on("error", (err) => console.error("Redis error:", err));

  // NÃO usar await aqui!
  client.connect().catch((err) => console.error("Redis connect error:", err));

  return new RedisStore({
    client,
    prefix: "sess:",
  });
}
