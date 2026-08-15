import { expect, test } from "bun:test"
import { $el } from "../src"

test("$el creates the requested element and configures its properties", () => {
	const button = $el("button", {
		textContent: "Submit",
		className: "primary-button",
		id: "submit-order",
		style: {
			color: "red",
		},
	})

	expect(button).toBeInstanceOf(HTMLButtonElement)
	expect(button.textContent).toBe("Submit")
	expect(button.className).toBe("primary-button")
	expect(button.id).toBe("submit-order")
	expect(button.style.color).toBe("red")
})

test("$el sets HTML content", () => {
	const element = $el("div", {
		innerHTML: "<strong>Important</strong>",
	})

	expect(element.innerHTML).toBe("<strong>Important</strong>")
})

test("$el appends the element and its children", () => {
	const parent = document.createElement("section")
	const firstChild = document.createElement("span")
	const secondChild = document.createElement("button")
	const element = $el("div", {
		appendTo: parent,
		children: [firstChild, secondChild],
	})

	expect([...parent.children]).toEqual([element])
	expect([...element.children]).toEqual([firstChild, secondChild])
})

test("$el attaches event listeners", () => {
	let receivedEvent: MouseEvent | undefined
	const button = $el("button", {
		on: {
			click: event => receivedEvent = event,
		},
	})
	const event = new MouseEvent("click")

	button.dispatchEvent(event)

	expect(receivedEvent).toBe(event)
})

test("$el attaches multiple listeners for an event", () => {
	const calls: string[] = []
	const button = $el("button", {
		on: {
			click: [
				() => calls.push("first"),
				() => calls.push("second"),
			],
		},
	})

	button.click()

	expect(calls).toEqual(["first", "second"])
})
