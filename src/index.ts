export type Selector = Parameters<typeof window.document.querySelector>[0]
export type Resolver<T = HTMLElement> = (element: T) => void

type Awaiter = {
	resolve: Resolver
	reject: (reason: Error) => void
}

export class Spawncamp {
	private awaitedElements = new Map<Selector, Set<Awaiter>>()
	private onArrival = new Map<Selector, Set<Resolver>>()
	private _stopped = false
	public get stopped() {
		return this._stopped
	}

	constructor(private root: HTMLElement | Document = document, private options: MutationObserverInit = {}) {
		this.observer.observe(this.root, {
			childList: true,
			subtree: true,
			...this.options,
		})
	}

	private observer = new MutationObserver((mutations) => {
		const resolveMatches = (element: HTMLElement) => {
			for (const [selector, awaiters] of this.awaitedElements) {
				if (element.matches(selector)) {
					for (const awaiter of awaiters) awaiter.resolve(element)
					this.awaitedElements.delete(selector)
				}
			}

			for (const [selector, callbacks] of this.onArrival) {
				if (element.matches(selector)) {
					for (const callback of callbacks) callback(element)
				}
			}
		}

		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
				resolveMatches(mutation.target)
			}

			for (const node of mutation.addedNodes) {
				if (node instanceof Element) {
					const arrivedElements = [node, ...node.querySelectorAll("*")]

					for (const element of arrivedElements) {
						if (!(element instanceof HTMLElement)) continue
						resolveMatches(element)
					}
				}
			}
		}
	})

	public stop = () => {
		this.observer.disconnect()
		this._stopped = true

		const error = new Error("Spawncamp is stopped")
		for (const awaiters of this.awaitedElements.values()) {
			for (const awaiter of awaiters) awaiter.reject(error)
		}
		this.awaitedElements.clear()
		this.onArrival.clear()
	}

	/** Awaits an element to arrive in the DOM once or returns a matching existing element */
	public once = <T = HTMLElement>(selector: Selector) => {
		if (this._stopped) return Promise.reject(new Error("Spawncamp is stopped"))

		const element = this.root.querySelector(selector)
		if (element) return Promise.resolve(element as T)

		const promise = new Promise<T>((resolve, reject) => {
			const awaiters = this.awaitedElements.get(selector) ?? new Set<Awaiter>()
			awaiters.add({ resolve: resolve as Resolver<HTMLElement>, reject })
			this.awaitedElements.set(selector, awaiters)
		})

		return promise
	}

	/** Calls the callback every time an element matching the selector arrives in the DOM */
	public on = <T extends HTMLElement>(
		selector: Selector,
		callback: Resolver<T>,
	) => {
		if (this._stopped) throw new Error("Spawncamp is stopped")

		const callbacks = this.onArrival.get(selector) ?? new Set<Resolver>()
		callbacks.add(callback as Resolver<HTMLElement>)
		this.onArrival.set(selector, callbacks)

		return () => {
			const removed = callbacks.delete(callback as Resolver<HTMLElement>)
			if (callbacks.size === 0) this.onArrival.delete(selector)
			return removed
		}
	}
}
