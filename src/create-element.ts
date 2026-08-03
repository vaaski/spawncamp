type CreateElementOptions = {
	textContent?: HTMLElement["textContent"]
	innerHTML?: HTMLElement["innerHTML"]
	className?: HTMLElement["className"]
	id?: HTMLElement["id"]
	style?: Partial<HTMLElement["style"]>
	appendTo?: HTMLElement
	children?: HTMLElement[]
}

/** element creation convenience wrapper */
export const $el = <T extends keyof HTMLElementTagNameMap>(
	tag: T,
	options: CreateElementOptions = {},
): HTMLElementTagNameMap[T] => {
	const element = document.createElement(tag)

	if (options.textContent) element.textContent = options.textContent
	if (options.innerHTML) element.innerHTML = options.innerHTML
	if (options.className) element.className = options.className
	if (options.id) element.id = options.id
	if (options.style) Object.assign(element.style, options.style)
	if (options.appendTo) options.appendTo.append(element)
	if (options.children) options.children.forEach(child => element.append(child))

	return element
}
