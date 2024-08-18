import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getBearByName, getBears, insertBear } from "./repo";
import { NewBearSchema } from "./schema";

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
  zValidator("json", NewBearSchema, (result, c) => {
    if (!result.success) {
      c.status(400);
      return c.json(result.error);
    }
  }),
  async (c) => {
    const bear = c.req.valid("json");
    const id = crypto.getRandomValues(new Uint32Array(1))[0];
    const insertedBear = await insertBear({ ...bear, id });

    c.status(201);
    return c.json(insertedBear);
  }
);

export default app;
