import { type } from "arktype";
import { db } from "./db";
import { bears } from "./schema";

export const Bear = type({
  id: "number",
  name: "alpha",
});

export type Bear = typeof Bear.infer;

export const NewBear = Bear.omit("id");

export function getBears(): Promise<Bear[]> {
  return db.query.bears.findMany();
}

export function getBearByName(name: string): Promise<Bear | undefined> {
  return db.query.bears.findFirst({
    where: (bear, { eq }) => eq(bear.name, name),
  });
}

export function insertBear(bear: Bear): Promise<Bear> {
  return db
    .insert(bears)
    .values(bear)
    .returning()
    .then(([insertedBear]) => insertedBear);
}
