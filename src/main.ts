import { evalProgram } from "./interpreter/eval/program.ts";
import { createGlobalScope } from "./interpreter/scope/globalScope.ts";
import { parse } from "./parser/parser.ts";
import { startREPL } from "./repl/repl.ts";
import options from "./options.json" assert { type: "json" };
import { runFromString, runRepl } from "./run.ts";

import { parse as parseFlags } from "https://deno.land/std@0.184.0/flags/mod.ts";

export const flags = parseFlags(Deno.args, {
	boolean: ["show-ast", "show-grammar"],
});

if (
	Deno.args.length !== 0 &&
	options.extensions.some((extension) => Deno.args[0].endsWith(`.${extension}`))
) {
	const code = await Deno.readTextFile(Deno.args[0]);

	runFromString(code);
} else {
	runRepl();
}
