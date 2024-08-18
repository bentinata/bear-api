import { Hono } from "hono";
import { name } from "../package.json" with { type: "json" };
import bears from "./bears/route";

const app = new Hono();


app.get("/", (c) => {
  return c.json({ name });
});

app.route("/bears", bears)


export default app;
