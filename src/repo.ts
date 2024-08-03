import { type } from "arktype";

export const Bear = type({
  id: "number",
  name: "alpha",
});

export type Bear = typeof Bear.infer;

export const NewBear = Bear.omit("id");

let bears: Bear[] = [];

export function getBears(): Bear[] {
  return bears;
}

export function setBears(newBears: Bear[]): Bear[] {
  bears = newBears;
  return bears;
}
