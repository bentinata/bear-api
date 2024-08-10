import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "./env";
import * as schema from "./schema";

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

const connection = postgres(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@0.0.0.0:5432/${POSTGRES_DB}`
);

export default drizzle(connection, { schema });
