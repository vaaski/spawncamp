import { test, expect } from "bun:test"
import { Spawncamp } from "../src"

test("await element multiple times", async (done) => {
	const camp = new Spawncamp()

	const button1 = document.createElement("button")
	const button2 = document.createElement("button")

	let counter = 0
	camp.on("button", (element) => {
		switch (counter) {
			case 0:
				expect(element).toStrictEqual(button1)
				break
			case 1:
				expect(element).toStrictEqual(button2)
				done()
				break
		}

		counter++
	})

	document.body.appendChild(button1)
	document.body.appendChild(button2)
})

test("remove .on() observer", () => {
	const camp = new Spawncamp()

	const remove = camp.on("button", () => {})
	expect(remove()).toBe(true)
})
