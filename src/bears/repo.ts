import { eq } from "drizzle-orm";
import { db } from "../db";
import { bears, type Bear, type NewBear, type UpdateBear } from "./schema";

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

export function updateBear(
  name: string,
  bear: UpdateBear
): Promise<Bear | undefined> {
  return db
    .update(bears)
    .set(bear)
    .where(eq(bears.name, name))
    .returning()
    .then(([updatedBear]) => updatedBear);
}
