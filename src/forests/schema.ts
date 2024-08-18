import { pgTable, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const forests = pgTable(
  "forests",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 64 }).notNull(),
  },
  (forest) => ({
    nameIndex: uniqueIndex().on(forest.name),
  })
);
