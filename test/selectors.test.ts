import { expect, test } from "bun:test"
import { $, $t } from "../src"

test("$ returns every matching element in document order", () => {
	const first = document.createElement("button")
	const second = document.createElement("button")
	document.body.append(first, second)

	expect($("button")).toEqual([first, second])
	expect($("input")).toEqual([])
})

test("$ returns only matches within the provided root", () => {
	const root = document.createElement("section")
	const inside = document.createElement("button")
	const outside = document.createElement("button")
	root.append(inside)
	document.body.append(root, outside)

	expect($("button", root)).toEqual([inside])
})

test("$t returns every match and throws for no matches", () => {
	const first = document.createElement("button")
	const second = document.createElement("button")
	document.body.append(first, second)

	expect($t("button")).toEqual([first, second])
	expect(() => $t("input")).toThrow("No element found for selector \"input\"")
})

test("$t returns only matches within the provided root", () => {
	const root = document.createElement("section")
	const inside = document.createElement("button")
	const outside = document.createElement("button")
	root.append(inside)
	document.body.append(root, outside)

	expect($t("button", root)).toEqual([inside])
	expect(() => $t("input", root)).toThrow("No element found for selector \"input\"")
})
