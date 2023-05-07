import { evalProgram } from "./interpreter/eval/program.ts";
import { createGlobalScope } from "./interpreter/scope/globalScope.ts";
import { parse } from "./parser/parser.ts";
import { startREPL } from "./repl/repl.ts";

export async function runFromString(code: string) {
	const scope = createGlobalScope();

	const program = parse(code);

	evalProgram(scope, program, false);
}

export function runRepl() {
	const scope = createGlobalScope();

	startREPL((code: string) => {
		const program = parse(code);

		const result = evalProgram(scope, program, false);

		console.log(result);
	});
}
