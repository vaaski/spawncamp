export type Selector = Parameters<typeof window.document.querySelector>[0]
export type Resolver<T = HTMLElement> = (element: T) => void

export class Spawncamp {
	private awaitedElements = new Map<Selector, Resolver>()
	private onArrival = new Map<Selector, Resolver>()
	private _stopped = false
	public get stopped() {
		return this._stopped
	}

	constructor(private root: HTMLElement | Document = document) {
		this.observer.observe(this.root, {
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
						const matches = node.matches(selector)

						if (matches) {
							resolve(node)
							this.awaitedElements.delete(selector)
						}
					}

					for (const [selector, resolve] of this.onArrival) {
						const matches = node.matches(selector)
						const isSame = lastArrived && node === lastArrived

						if (matches && !isSame) {
							lastArrived = node
							resolve(node)
						}
					}
				}
			}
		}
	})

	public stop = () => {
		this.observer.disconnect()
		this._stopped = true
	}

	/** Awaits an element to arrive in the DOM once or returns a matching existing element */
	public once = <T = HTMLElement>(selector: Selector) => {
		if (this._stopped) return Promise.reject(new Error("Spawncamp is stopped"))

		if (this.awaitedElements.has(selector)) {
			return Promise.resolve(this.awaitedElements.get(selector) as T)
		}

		const element = this.root.querySelector(selector)
		if (element) return Promise.resolve(element as T)

		const promise = new Promise<T>((resolve) => {
			this.awaitedElements.set(selector, resolve as Resolver<HTMLElement>)
		})

		return promise
	}

	/** Calls the callback every time an element matching the selector arrives in the DOM */
	public on = <T extends HTMLElement>(
		selector: Selector,
		callback: Resolver<T>,
	) => {
		if (this._stopped) throw new Error("Spawncamp is stopped")

		this.onArrival.set(selector, callback as Resolver<HTMLElement>)

		return () => this.onArrival.delete(selector)
	}
}
