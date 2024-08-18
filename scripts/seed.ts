import { connection, db } from "../src/db";
import { bears, forests, sleuthAttendees, sleuths } from "../src/db/schema";

const insertedBears = await db
  .insert(bears)
  .values([
    { name: "aan" },
    { name: "ben" },
    { name: "brian" },
    { name: "fia" },
    { name: "raid" },
    { name: "rizal" },
  ])
  .onConflictDoNothing()
  .returning();

const insertedForests = await db
  .insert(forests)
  .values([
    { name: "html+css" },
    { name: "js" },
    { name: "react" },
    { name: "api" },
    { name: "fullstack" },
    { name: "team" },
  ])
  .onConflictDoNothing()
  .returning();

const insertedSleuths = await db
  .insert(sleuths)
  .values([
    {
      id: 1,
      title: "day 25: api framework",
      forestId: insertedForests[3].id,
      scheduledDatetime: new Date("2024-07-27T13:00:00+0700"),
    },
    {
      id: 2,
      title: "day 32: api presentation",
      forestId: insertedForests[3].id,
      scheduledDatetime: new Date("2024-08-20T19:30:00+0700"),
    },
  ])
  .onConflictDoNothing()
  .returning();

await db
  .insert(sleuthAttendees)
  .values(
    insertedSleuths.flatMap((sleuth) =>
      insertedBears.map((bear) => ({
        sleuthId: sleuth.id,
        bearId: bear.id,
        status: bear.name === "ben" ? ("mentor" as const) : ("cub" as const),
      }))
    )
  )
  .onConflictDoNothing();

await connection.end();
