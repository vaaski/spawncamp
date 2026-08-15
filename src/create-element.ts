type EventHandlers = {
	[K in keyof HTMLElementEventMap]?: ((event: HTMLElementEventMap[K]) => void) | ((event: HTMLElementEventMap[K]) => void)[]
}

type CreateElementOptions = {
	textContent?: HTMLElement["textContent"]
	innerHTML?: HTMLElement["innerHTML"]
	className?: HTMLElement["className"]
	id?: HTMLElement["id"]
	style?: Partial<CSSStyleDeclaration>
	appendTo?: HTMLElement
	children?: HTMLElement[]
	on?: EventHandlers
}

/** element creation convenience wrapper */
export const $el = <T extends keyof HTMLElementTagNameMap>(
	tag: T,
	options: CreateElementOptions = {},
): HTMLElementTagNameMap[T] => {
	const element = document.createElement(tag)

	if (options.textContent !== undefined) element.textContent = options.textContent
	if (options.innerHTML !== undefined) element.innerHTML = options.innerHTML
	if (options.className !== undefined) element.className = options.className
	if (options.id !== undefined) element.id = options.id
	if (options.style) Object.assign(element.style, options.style)
	if (options.appendTo) options.appendTo.append(element)
	if (options.children) element.append(...options.children)

	if (options.on) {
		for (const event of Object.keys(options.on) as (keyof HTMLElementEventMap)[]) {
			const listeners = Array.isArray(options.on[event]) ? options.on[event] : [options.on[event]]

			for (const listener of listeners) {
				element.addEventListener(event, listener as EventListener)
			}
		}
	}

	return element
}
