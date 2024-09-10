# spawncamp

A tiny library for userscripts that waits for elements to arrive in the DOM.

## Installing

```bash
npm i spawncamp
```

## Usage

```ts
import { Spawncamp } from "spawncamp"

const camp = new Spawncamp()

// Awaits the button element to arrive in the DOM once
const button = await camp.once("button")

button.addEventListener("click", () => {
	console.log("Clicked!")
})

// Calls the callback every time an element matching the selector arrives in the DOM
const remove = camp.on("button", (element) => {
	console.log("New button just dropped", element)
})

// Removes the observer for that selector
remove()

// Stops observing the DOM entirely
camp.stop()
```

## Development

To install dependencies:

```bash
bun install
```

Run tests:

```bash
bun test
```

Build:

```bash
bun run build.ts
```

This project was created using `bun init` with bun v1.1.27.

It uses [Biome](https://biomejs.dev) for formatting and linting.
