import { Hono } from "hono";
import { type } from "arktype";
import { validator } from "hono/validator";

const app = new Hono();

const Bear = type({
  id: "number",
  name: "alpha",
});

type Bear = typeof Bear.infer;

const NewBear = Bear.omit("id");

let bears: Bear[] = [];

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/bears", (c) => {
  return c.json(bears);
});

app.get("/bears/:name", (c) => {
  const bear = bears.find(({ name }) => c.req.param("name") === name);

  if (!bear) {
    c.status(404);
    return c.json(null);
  }

  return c.json(bear);
});

app.post(
  "/bears",
  validator("json", (value, c) => {
    const parsed = NewBear(value);

    if (parsed instanceof type.errors) {
      c.status(400);
      return c.json(parsed.summary);
    }

    return parsed;
  }),
  (c) => {
    const bear = c.req.valid("json");

    const id = crypto.getRandomValues(new Uint32Array(1))[0];

    bears.push({ id, ...bear });

    c.status(201);
    return c.json(bear);
  }
);

export default app;
