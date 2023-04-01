import { evalProgram, evaluate } from "./interpreter/index.ts";
import { createScope } from "./interpreter/scope.ts";
import { tokenize, TokenTypes } from "./lexer.ts";
import { parse } from "./parser/index.ts";
const startREPL = (processor: (input: string) => any) => {
	while (true) {
		const code = prompt("-> ");

		if (!code) {
			continue;
		}

		if (code?.startsWith(";")) {
			switch (code.slice(1).toLowerCase()) {
				case "cls":
					console.log("\n".repeat(100));
					break;
			}

			continue;
		}

		let result: any = null;

		try {
			result = processor(code);
		} catch (e) {
			console.error(e);

			continue;
		}

		console.log(result);
	}
};

const globalScope = createScope();

startREPL((code: string) => {
	const tokens = tokenize(code);

	const ast = parse(tokens);

	const result = evalProgram(ast, globalScope, false).toString();

	return result;
});
