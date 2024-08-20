import {
  pgEnum,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const bearStatus = pgEnum("bear_status", ["CREATED", "DELETED"]);

export const bears = pgTable(
  "bears",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 64 }).notNull(),
    status: bearStatus("status").notNull().default("CREATED"),
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

export const UpdateBearSchema = NewBearSchema.omit({ id: true }).partial();
export type UpdateBear = Zod.infer<typeof UpdateBearSchema>;
