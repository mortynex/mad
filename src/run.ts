import { ErrorType, InterpreterError, throwFormatedError } from "./errors.ts";
import { evalProgram } from "./interpreter/eval/program.ts";
import { createGlobalScope } from "./interpreter/scope/globalScope.ts";
import { transformValue } from "./interpreter/values/transformers.ts";
import { TokenTypes } from "./lexer/tokens.ts";
import { parse } from "./parser/parser.ts";
import { startREPL } from "./repl/repl.ts";
import options from "./options.json" assert { type: "json" };
import { Scope } from "./interpreter/scope/scope.ts";
import { mkNull } from "./interpreter/values/factories.ts";
import { flags } from "./main.ts";

const runSafely = (code: string, scope: Scope) => {
	let program;

	try {
		program = parse(code);
	} catch (e) {
		const { type, message, token } = e;

		if (type === ErrorType.Internal) {
			throwFormatedError(message, code, token.line, token.col);
			return;
		}

		if (!token) {
			console.error("Internal error: unhanled parser error:");

			if (options.debugging) console.error(e);

			return;
		}

		let newMessage =
			`Unexpected token "${token.value}" ` +
			`at line ${token.line} col ${token.col}.`;

		let expected = message
			.match(/(?<=A ).*(?= based on:)/g)
			?.map((s: string) => TokenTypes[Number(s.replace(/\s+token/i, ""))]);

		if (expected?.length)
			newMessage += `\nI was expecting tokens: ${[
				...new Set(expected).values(),
			].join(", ")}`;

		throwFormatedError(newMessage, code, token.line, token.col);

		return;
	}

	if (flags["show-ast"]) console.dir(program, { depth: Infinity });

	let result;

	try {
		result = evalProgram(scope, program);
	} catch (error) {
		if (error instanceof InterpreterError) {
			throwFormatedError(error.message, code, error.node.line, error.node.col);

			return;
		} else {
			console.error("Internal error: unhanled interpreter error");

			if (options.debugging) console.error(error);
		}
	}

	return result;
};

export async function runFromString(code: string) {
	const scope = createGlobalScope();

	runSafely(code, scope);
}

export function runRepl() {
	const scope = createGlobalScope();

	startREPL("(╬ ಠ益ಠ) ?? ➡️", (code: string) => {
		const result = runSafely(code, scope) ?? mkNull();

		// @ts-ignore
		console.log(`↩️ ${transformValue(result)}\n`);
	});
}
