import { type } from "arktype";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { name } from "../package.json" with { type: "json" };
import { getBears, NewBear, setBears } from "./repo";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ name });
});

app.get("/bears", (c) => {
  return c.json(getBears());
});

app.get("/bears/:name", (c) => {
  const bear = getBears().find(({ name }) => c.req.param("name") === name);

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

    const bears = getBears();
    bears.push({ id, ...bear });
    setBears(bears);

    c.status(201);
    return c.json(bear);
  }
);

export default app;
