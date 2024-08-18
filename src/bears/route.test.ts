import { type } from "arktype";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import app from "./route";
import * as repo from "./repo";

beforeEach(() => {
  mock.restore();
});

// TODO: Use faker here somehow
const mockedBear = repo.Bear({
  id: 1,
  name: "ben",
});

if (mockedBear instanceof type.errors) {
  process.exit(1);
}

const { id, ...validNewBear } = mockedBear;
const invalidNewBear = { name: "123" };

describe("GET /", () => {
  it("should return list of bears", async () => {
    spyOn(repo, "getBears").mockResolvedValue([mockedBear]);

    const res = await app.request("/");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body).toHaveProperty("0.id", mockedBear.id);
  });

  it("should return empty list when there are no bears", async () => {
    spyOn(repo, "getBears").mockResolvedValue([]);

    const res = await app.request("/");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(0);
  });
});

describe("POST /", () => {
  it("should create new bear", async () => {
    const mockedSetBears = spyOn(repo, "insertBear").mockResolvedValue(
      mockedBear
    );

    const res = await app.request("/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(validNewBear),
    });

    expect(res.status).toBe(201);
    expect(mockedSetBears).toHaveBeenCalled();
  });

  it("should return error when new bear is invalid", async () => {
    const mockedSetBears = spyOn(repo, "insertBear").mockResolvedValue(
      mockedBear
    );

    const res = await app.request("/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(invalidNewBear),
    });

    expect(res.status).toBe(400);
    expect(mockedSetBears).not.toHaveBeenCalled();
  });
});

describe("GET /:name", () => {
  it("should return details of bear", async () => {
    const mockedGetBearByName = spyOn(repo, "getBearByName").mockResolvedValue(
      mockedBear
    );
    const res = await app.request("/ben");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("id", mockedBear.id);
    expect(mockedGetBearByName).toHaveBeenCalledWith("ben");
  });

  it("should return error when bear does not exist", async () => {
    const mockedGetBearByName = spyOn(repo, "getBearByName").mockResolvedValue(
      undefined
    );
    const res = await app.request("/ghost");

    expect(res.status).toBe(404);
    expect(mockedGetBearByName).toHaveBeenCalledWith("ghost");
  });
});

describe.todo("PATCH /:name", () => {
  it("should update and return new details of bear", async () => {
    const res = await app.request("/1", {
      method: "PATCH",
    });

    expect(res.status).toBe(200);
    expect().fail("implementation needed");
  });

  it("should return error when updated bear does not exist", async () => {
    const res = await app.request("/1", {
      method: "PATCH",
    });

    expect(res.status).toBe(422);
    expect().fail("implementation needed");
  });
});

describe.todo("DELETE /:name", () => {
  it("should delete existing bear", async () => {
    const res = await app.request("/", {
      method: "DELETE",
    });

    expect(res.status).toBe(204);
    expect().fail("implementation needed");
  });

  it("should return error when deleted bear does not exist", async () => {
    const res = await app.request("/", {
      method: "DELETE",
    });

    expect(res.status).toBe(422);
    expect().fail("implementation needed");
  });

  it("should return error when deleted bear is already deleted", async () => {
    const res = await app.request("/", {
      method: "DELETE",
    });

    expect(res.status).toBe(410);
    expect().fail("implementation needed");
  });
});
