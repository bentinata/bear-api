import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import * as repo from "./repo";
import app from "./route";
import { BearSchema } from "./schema";

beforeEach(() => {
  mock.restore();
});

// TODO: Use faker here somehow
const mockedBear = BearSchema.parse({
  id: 1,
  name: "ben",
});

const { id, ...validNewBear } = mockedBear;
const invalidNewBear = { name: "123" };

const headers: HeadersInit = {
  "content-type": "application/json",
};

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
      headers,
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
      headers,
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

describe("PATCH /:name", () => {
  it("should update and return new details of bear", async () => {
    const mockedUpdateBear = spyOn(repo, "updateBear").mockResolvedValue(
      mockedBear
    );
    const res = await app.request("/ben", {
      method: "PATCH",
      headers,
      body: JSON.stringify(validNewBear),
    });

    expect(res.status).toBe(200);
    expect(mockedUpdateBear).toBeCalledWith("ben", validNewBear);
  });

  it("should err when updated bear is invalid", async () => {
    const mockedUpdateBear = spyOn(repo, "updateBear").mockResolvedValue(
      mockedBear
    );
    const res = await app.request("/ben", {
      method: "PATCH",
      headers,
      body: JSON.stringify(invalidNewBear),
    });

    expect(res.status).toBe(400);
    expect(mockedUpdateBear).not.toBeCalled();
  });

  it("should return error when updated bear does not exist", async () => {
    const mockedUpdateBear = spyOn(repo, "updateBear").mockResolvedValue(
      undefined
    );
    const res = await app.request("/ghost", {
      method: "PATCH",
      headers,
      body: JSON.stringify(validNewBear),
    });

    expect(res.status).toBe(422);
    expect(mockedUpdateBear).toBeCalledWith("ghost", validNewBear);
  });

  it("should return error when database update failed", async () => {
    const mockedUpdateBear = spyOn(repo, "updateBear").mockRejectedValue(
      new Error()
    );
    const res = await app.request("/ben", {
      method: "PATCH",
      headers,
      body: JSON.stringify(validNewBear),
    });

    expect(res.status).toBe(500);
    expect(mockedUpdateBear).toBeCalledWith("ben", validNewBear);
  });
});

describe("DELETE /:name", () => {
  it("should delete existing bear", async () => {
    const mockedSoftDeleteBear = spyOn(
      repo,
      "softDeleteBear"
    ).mockResolvedValue(mockedBear);
    const res = await app.request("/ben", {
      method: "DELETE",
    });

    expect(res.status).toBe(204);
    expect(mockedSoftDeleteBear).toBeCalledWith("ben");
  });

  it("should return error when deleted bear does not exist", async () => {
    const mockedSoftDeleteBear = spyOn(
      repo,
      "softDeleteBear"
    ).mockResolvedValue(undefined);
    const res = await app.request("/ghost", {
      method: "DELETE",
    });

    expect(res.status).toBe(422);
    expect(mockedSoftDeleteBear).toBeCalledWith("ghost");
  });

  it.todo("should return error when deleted bear is already deleted", async () => {
    const res = await app.request("/", {
      method: "DELETE",
    });

    expect(res.status).toBe(410);
  });
});
