import { expect, test } from "bun:test"
import { Spawncamp } from "../src"

test("stops observing completely", async () => {
	const camp = new Spawncamp()
	const pending = camp.once("button")

	expect(camp.stopped).toBe(false)
	camp.stop()
	expect(camp.stopped).toBe(true)

	expect(camp.once("body")).rejects.toThrow()
	expect(pending).rejects.toThrow()
	expect(() => camp.on("body", () => {})).toThrow()
})
