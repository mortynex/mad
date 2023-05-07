import { evalProgram } from "./interpreter/eval/program.ts";
import { createGlobalScope } from "./interpreter/scope/globalScope.ts";
import { parse } from "./parser/parser.ts";
import { startREPL } from "./repl/repl.ts";
import options from "./options.json" assert { type: "json" };
import { runFromString, runRepl } from "./run.ts";

if (Deno.args.length === 0) {
	if (Deno.args[0].toLowerCase() === "--repl") {
		runRepl();
	} else if (
		options.extensions.some((extension) =>
			Deno.args[0].endsWith(`.${extension}`)
		)
	) {
		const code = await Deno.readTextFile(Deno.args[0]);

		runFromString(code);
	}
}
