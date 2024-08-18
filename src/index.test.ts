import { describe, expect, it } from "bun:test";
import app from "./index";

describe("/", () => {
  it("should return OK", async () => {
    const res = await app.request("/");

    expect(res.status).toBe(200);
  });
});
