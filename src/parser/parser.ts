import nearley from "npm:nearley";
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
		console.warn("Ambigius grammar detected");
	}

	return nearleyParser.results[0];
};
