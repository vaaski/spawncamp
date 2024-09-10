import { test, expect } from "bun:test"
import { Spawncamp } from "../src"

test("find existing element", async () => {
	const camp = new Spawncamp()

	const button = document.createElement("button")
	document.body.appendChild(button)

	const foundButton = await camp.once("button")
	expect(foundButton).toStrictEqual(button)

	button.remove()
})

test("await element once", async () => {
	const camp = new Spawncamp()

	const foundButtonPromise = camp.once("button")

	const button = document.createElement("button")
	document.body.appendChild(button)

	const foundButton = await foundButtonPromise
	expect(foundButton).toStrictEqual(button)
})
