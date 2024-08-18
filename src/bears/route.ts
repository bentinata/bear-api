import { type } from "arktype";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { getBearByName, getBears, insertBear, NewBear } from "./repo";

const app = new Hono();

app.get("/", async (c) => {
  return c.json(await getBears());
});

app.get("/:name", async (c) => {
  const bear = await getBearByName(c.req.param("name"));

  if (!bear) {
    c.status(404);
    return c.json(null);
  }

  return c.json(bear);
});

app.post(
  "/",
  validator("json", (value, c) => {
    const parsed = NewBear(value);

    if (parsed instanceof type.errors) {
      c.status(400);
      return c.json(parsed.summary);
    }

    return parsed;
  }),
  async (c) => {
    const bear = c.req.valid("json");

    const id = crypto.getRandomValues(new Uint32Array(1))[0];

    const insertedBear = await insertBear({ id, ...bear });

    c.status(201);
    return c.json(insertedBear);
  }
);

export default app;
