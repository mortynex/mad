import { evaluate } from "./interpreter/index.ts";
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

startREPL((code: string) => {
	return evaluate(parse(tokenize(code))).toString();
});
