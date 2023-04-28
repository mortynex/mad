import { parse } from "./parser/parser.ts";
const options = {
	showOnlyTokens: false,
	showOnlyAST: false,
};

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

				case "tokens":
					options.showOnlyTokens = !options.showOnlyTokens;

					break;

				case "ast":
					options.showOnlyAST = !options.showOnlyAST;
					options.showOnlyTokens = false;

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
	return parse(code);
});
