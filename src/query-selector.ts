/**
 * Convenience wrapper for `document.querySelectorAll`,
 * returns as `Array` instead of `NodeList`
 *
 * @param selector any valid querySelector
 * @see `$t` for a auto-throw variant if the element can't be found
 * @example
 * ```ts
 * // type is inferred from element tag name
 * const [button] = $("button")
 * //       ^? HTMLButtonElement | undefined
 * ```
 *
 * @example
 * ```ts
 * // type is provided manually
 * const [input] = $<HTMLInputElement>(".some-input")
 * //       ^? HTMLInputElement | undefined
 * ```
 */
export function $<K extends keyof HTMLElementTagNameMap, R extends Element = Element>(selector: K, root?: R): HTMLElementTagNameMap[K][]
export function $<E extends HTMLElement, R extends Element = Element>(selectors: string, root?: R): E[]
export function $(selector: string, root = document) {
	return [...root.querySelectorAll(selector)]
}

/**
 * Convenience wrapper for `document.querySelectorAll`,
 * returns as `Array` instead of `NodeList` and throws when no elements are found
 *
 * It also guarantees that the first element in the array is defined on a type-level
 *
 * @param selector any valid querySelector
 * @throws if no elements are found
 * @see `$` for a non-throwing variant
 * @example
 * ```ts
 * // type is inferred from element tag name
 * const [button] = $t("button")
 * //       ^? HTMLButtonElement
 * ```
 *
 * @example
 * ```ts
 * // type is provided manually
 * const [input] = $t<HTMLInputElement>(".some-input")
 * //       ^? HTMLInputElement
 * ```
 */
export function $t<K extends keyof HTMLElementTagNameMap, R extends Element = Element>(selector: K, root?: R): [HTMLElementTagNameMap[K], ...HTMLElementTagNameMap[K][]]
export function $t<E extends HTMLElement, R extends Element = Element>(selectors: string, root?: R): [E, ...E[]]
export function $t(selector: string, root = document) {
	const result = [...root.querySelectorAll(selector)]
	if (result.length === 0) throw new Error(`No element found for selector "${selector}"`)

	return result
}
