import nearley from "npm:nearley";
import { ErrorType } from "../errors.ts";
import { lexer } from "../lexer/lexer.ts";
import { grammar } from "./grammar.ts";

const compiledGrammar = nearley.Grammar.fromCompiled(
	grammar.buildGrammar(lexer)
);

export const parse = (text: string) => {
	const nearleyParser = new nearley.Parser(compiledGrammar, {
		keepHistory: true,
	});

	nearleyParser.feed(text);

	if (nearleyParser.results.length > 1) {
		console.warn("Language design error: Ambigius grammar detected 🫣");

		console.log(`Found ${nearleyParser.results.length} possible results`);
	}

	if (nearleyParser.results.length === 0) {
		throw {
			type: ErrorType.Internal,
			message: "Unexpected end of output",
			token: { line: 0, col: -1 },
		};
	}

	return nearleyParser.results[0];
};
