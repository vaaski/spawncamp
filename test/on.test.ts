import { expect, test } from "bun:test"
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

test("observe matching descendants and multiple callbacks", async () => {
	const camp = new Spawncamp()
	const button = document.createElement("button")
	const wrapper = document.createElement("div")
	const arrivals: HTMLElement[] = []
	camp.on("button", (element) => arrivals.push(element))
	camp.on("button", (element) => arrivals.push(element))
	const arrived = camp.once("button")
	wrapper.appendChild(button)

	document.body.appendChild(wrapper)
	await arrived

	expect(arrivals).toEqual([button, button])
})

test("observe an element that matches after an attribute change", async (done) => {
	const button = document.createElement("button")
	button.className = "continue-button"
	button.disabled = true
	document.body.appendChild(button)
	const camp = new Spawncamp(document, { attributes: true, subtree: true })

	camp.on(".continue-button:not([disabled])", (element) => {
		expect(element).toStrictEqual(button)
		done()
	})

	button.disabled = false
})
