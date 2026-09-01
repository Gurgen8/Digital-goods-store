import { describe, expect, it } from "vitest"
import { API_URL } from "../src/api/client"

describe("API_URL", () => {
  it("does not end with slash", () => {
    expect(API_URL.endsWith("/")).toBe(false)
  })
})

