import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "../env";
import * as schema from "./schema";

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
  process.env;

export const connection = postgres(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${
    POSTGRES_HOST || "0.0.0.0"
  }:5432/${POSTGRES_DB}`
);

export const db = drizzle(connection, { schema });
