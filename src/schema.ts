import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

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

export const sleuths = pgTable("sleuths", {
  id: serial("id").notNull().primaryKey(),
  title: varchar("title", { length: 64 }).notNull(),
  forestId: integer("forest_id")
    .notNull()
    .references(() => forests.id),
  scheduledDatetime: timestamp("scheduled_datetime", {
    withTimezone: true,
  }).notNull(),
});

export const sleuthStatus = pgEnum("status", ["mentor", "cub"]);

export const sleuthAttendees = pgTable(
  "sleuth_participants",
  {
    sleuthId: integer("sleuth_id")
      .notNull()
      .references(() => sleuths.id),
    bearId: integer("bear_id")
      .notNull()
      .references(() => bears.id),
    status: sleuthStatus("status").notNull(),
  },
  (participant) => ({
    pk: primaryKey({ columns: [participant.bearId, participant.sleuthId] }),
  })
);
