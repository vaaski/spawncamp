import { test, expect } from "bun:test"
import { Spawncamp } from "../src"

test("stops observing completely", async () => {
	const camp = new Spawncamp()

	expect(camp.stopped).toBe(false)
	camp.stop()
	expect(camp.stopped).toBe(true)

	expect(camp.once("body")).rejects.toThrow()
	expect(() => camp.on("body", () => {})).toThrow()
})
