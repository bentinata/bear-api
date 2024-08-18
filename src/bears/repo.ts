import { db } from "../db";
import { bears, type Bear, type NewBear } from "./schema";

export function getBears(): Promise<Bear[]> {
  return db.query.bears.findMany();
}

export function getBearByName(name: string): Promise<Bear | undefined> {
  return db.query.bears.findFirst({
    where: (bear, { eq }) => eq(bear.name, name),
  });
}

export function insertBear(bear: NewBear): Promise<Bear> {
  return (
    db
      .insert(bears)
      // https://github.com/drizzle-team/drizzle-orm/pull/2809
      // @ts-expect-error
      .values(bear)
      .returning()
      .then(([insertedBear]) => insertedBear)
  );
}
