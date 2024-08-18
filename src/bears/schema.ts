import { pgTable, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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

export const BearSchema = createSelectSchema(bears);
export type Bear = Zod.infer<typeof BearSchema>;

export const NewBearSchema = createInsertSchema(bears, {
  name: (schema) =>
    schema.name.max(bears.name.columnType.length).regex(/^[a-z]+$/, {
      message: "String should only contain lowercase character",
    }),
});
export type NewBear = Zod.infer<typeof NewBearSchema>;
