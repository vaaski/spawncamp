import { watch } from "node:fs"
import path from "node:path"
import { parseArgs, styleText } from "node:util"
import dts from "bun-plugin-dts"

const { values } = parseArgs({
	args: process.argv.slice(2),
	options: {
		watch: {
			type: "boolean",
			short: "w",
		},
	},
})

const build = async () => {
	await Bun.build({
		entrypoints: ["./src/index.ts"],
		outdir: "./dist",
		minify: true,
		plugins: [dts()],
	})
}

const startWatching = (folder: string) => {
	watch(path.join(import.meta.dir, folder), { recursive: true }, async (event, filename) => {
		process.stdout.write(`${styleText("gray", `[${event}]`)} ${folder}/${filename}`)
		await build()
		console.log(styleText("green", " ✓"))
	})
}

if (values.watch) {
	startWatching("src")
	console.log(styleText("gray", "watching..."))
} else {
	await build()

	console.log(`done ${styleText("green", "✓")}`)
}
