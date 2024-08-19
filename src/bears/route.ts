import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import postgres from "postgres";
import { getBearByName, getBears, insertBear, updateBear } from "./repo";
import { NewBearSchema, UpdateBearSchema } from "./schema";

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

app.patch(
  "/:name",
  zValidator("json", UpdateBearSchema, (result, c) => {
    if (!result.success) {
      c.status(400);
      return c.json(result.error);
    }
  }),
  async (c) => {
    try {
      const updatedBear = await updateBear(
        c.req.param("name"),
        c.req.valid("json")
      );

      if (!updatedBear) {
        c.status(422);
        return c.json(null);
      }

      c.status(200);
      return c.json(updatedBear);
    } catch (e) {
      c.status(500);

      if (e instanceof postgres.PostgresError) {
        return c.json(e.detail);
      } else if (typeof e === "string" || e instanceof Error) {
        return c.json(e);
      }

      return c.json(JSON.stringify(e));
    }
  }
);

export default app;
