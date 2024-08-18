import { pgTable, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const bears = pgTable(
  "bears",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 64 }).notNull(),
  },
  (bear) => ({
    nameIndex: uniqueIndex().on(bear.name),
  })
);
