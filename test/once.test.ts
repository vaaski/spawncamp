import { expect, test } from "bun:test"
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

test("find matching descendant of an added element", async () => {
	const camp = new Spawncamp()
	const foundButtonPromise = camp.once("button")
	const wrapper = document.createElement("div")
	const button = document.createElement("button")
	wrapper.appendChild(button)

	document.body.appendChild(wrapper)

	expect(await foundButtonPromise).toStrictEqual(button)
})

test("resolve concurrent waits for the same selector", async () => {
	const camp = new Spawncamp()
	const first = camp.once("button")
	const second = camp.once("button")
	const button = document.createElement("button")

	document.body.appendChild(button)

	expect(await Promise.all([first, second])).toEqual([button, button])
})

test("await an element that matches after an attribute change", async () => {
	const button = document.createElement("button")
	button.className = "continue-button"
	button.disabled = true
	document.body.appendChild(button)
	const camp = new Spawncamp(document, { attributes: true, subtree: true })

	const foundButton = camp.once(".continue-button:not([disabled])")
	button.disabled = false

	expect(await foundButton).toStrictEqual(button)
})
