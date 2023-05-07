import { ErrorType, InterpreterError, throwFormatedError } from "./errors.ts";
import { evalProgram } from "./interpreter/eval/program.ts";
import { createGlobalScope } from "./interpreter/scope/globalScope.ts";
import { transformValue } from "./interpreter/values/transformers.ts";
import { parse } from "./parser/parser.ts";
import { startREPL } from "./repl/repl.ts";

export async function runFromString(code: string) {
	const scope = createGlobalScope();

	const program = parse(code);

	evalProgram(scope, program, false);
}

export function runRepl() {
	const scope = createGlobalScope();

	startREPL("(╬ ಠ益ಠ) ?? ➡️", (code: string) => {
		let program;

		try {
			program = parse(code);
		} catch (e) {
			const { type, message, token } = e;

			if (type === ErrorType.Internal) {
				throwFormatedError(message, code, token.line, token.col);
				return;
			}

			const newMessage =
				`Unexpected character "${token.value}" ` +
				`at line ${token.line} col ${token.col}.`;

			throwFormatedError(newMessage, code, token.line, token.col);

			return;
		}

		let result;

		try {
			result = evalProgram(scope, program, false);
		} catch (error) {
			if (error instanceof InterpreterError) {
				throwFormatedError(
					error.message,
					code,
					error.node.line,
					error.node.col
				);

				return;
			}
		}

		// @ts-ignore
		console.log(`↩️ ${transformValue(result)}\n`);
	});
}
