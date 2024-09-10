export type Selector = Parameters<typeof window.document.querySelector>[0]
export type Resolver<T = HTMLElement> = (element: T) => void

export class Spawncamp {
	private awaitedElements = new Map<Selector, Resolver>()
	private onArrival = new Map<Selector, Resolver>()

	constructor(root: Node = document) {
		this.observer.observe(root, {
			childList: true,
			subtree: true,
		})
	}

	private observer = new MutationObserver((mutations) => {
		let lastArrived: HTMLElement | undefined

		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node instanceof HTMLElement) {
					for (const [selector, resolve] of this.awaitedElements) {
						const element = node.querySelector<HTMLElement>(selector)

						if (element) {
							resolve(element)
							this.awaitedElements.delete(selector)
						}
					}

					for (const [selector, resolve] of this.onArrival) {
						const element = node.querySelector<HTMLElement>(selector)
						const isSame = lastArrived && element?.isEqualNode(lastArrived)

						if (element && !isSame) {
							lastArrived = element
							resolve(element)
						}
					}
				}
			}
		}
	})

	public stop = () => this.observer.disconnect()

	/** Awaits an element to arrive in the DOM once */
	public once = <T = HTMLElement>(selector: Selector) => {
		if (this.awaitedElements.has(selector)) {
			return Promise.resolve(this.awaitedElements.get(selector) as T)
		}

		const element = document.querySelector(selector)
		if (element) return Promise.resolve(element as T)

		const promise = new Promise<T>((resolve) => {
			this.awaitedElements.set(selector, resolve as Resolver<HTMLElement>)
		})

		return promise
	}

	/* Calls the callback every time an element matching the selector arrives in the DOM */
	public on = <T extends HTMLElement>(
		selector: Selector,
		callback: Resolver<T>,
	) => {
		this.onArrival.set(selector, callback as Resolver<HTMLElement>)

		return () => this.onArrival.delete(selector)
	}
}
