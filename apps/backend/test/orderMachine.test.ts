import { describe, expect, it } from "vitest"
import { computeInitialDeliveryOutcome } from "../src/logic/orderMachine.js"

describe("computeInitialDeliveryOutcome", () => {
  it("returns a stable outcome for same id", () => {
    expect(computeInitialDeliveryOutcome("abc")).toBe(
      computeInitialDeliveryOutcome("abc")
    )
  })
})

