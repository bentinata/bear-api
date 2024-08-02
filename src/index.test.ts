import { describe, expect, it } from "bun:test";
import app from "./index";

describe("/", () => {
  it("should return OK", async () => {
    const res = await app.request("/");

    expect(res.status).toBe(200);
  });
});

describe("GET /bears", () => {
  it("should return list of bears", async () => {
    const res = await app.request("/bears");

    expect(res.status).toBe(200);
    expect().fail("implementation needed");
  });

  it("should return empty list when there are no bears", async () => {
    const res = await app.request("/bears");

    expect(res.status).toBe(200);
    expect().fail("implementation needed");
  });
});

describe("POST /bears", () => {
  it("should create new bear", async () => {
    const res = await app.request("/bears", {
      method: "POST",
    });

    expect(res.status).toBe(201);
    expect().fail("implementation needed");
  });
});

describe("GET /bears/:id", () => {
  it("should return details of bear", async () => {
    const res = await app.request("/bears/1");

    expect(res.status).toBe(200);
    expect().fail("implementation needed");
  });

  it("should return error when bear does not exist", async () => {
    const res = await app.request("/bears/1");

    expect(res.status).toBe(404);
    expect().fail("implementation needed");
  });
});

describe("PATCH /bears/:id", () => {
  it("should update and return new details of bear", async () => {
    const res = await app.request("/bears/1", {
      method: "PATCH",
    });

    expect(res.status).toBe(200);
    expect().fail("implementation needed");
  });

  it("should return error when updated bear does not exist", async () => {
    const res = await app.request("/bears/1", {
      method: "PATCH",
    });

    expect(res.status).toBe(422);
    expect().fail("implementation needed");
  });
});

describe("DELETE /bears/:id", () => {
  it("should delete existing bear", async () => {
    const res = await app.request("/bears", {
      method: "DELETE",
    });

    expect(res.status).toBe(204);
    expect().fail("implementation needed");
  });

  it("should return error when deleted bear does not exist", async () => {
    const res = await app.request("/bears", {
      method: "DELETE",
    });

    expect(res.status).toBe(422);
    expect().fail("implementation needed");
  });

  it("should return error when deleted bear is already deleted", async () => {
    const res = await app.request("/bears", {
      method: "DELETE",
    });

    expect(res.status).toBe(410);
    expect().fail("implementation needed");
  });
});
