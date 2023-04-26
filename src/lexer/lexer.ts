import moo from "npm:moo";
import { BinaryOperators } from "../interpreter/values.ts";
import { Token, TokenTypes } from "./tokens.ts";

export interface Lexer {
	reset: (chunk: string, info: any) => void;
	next: () => Token;
	save: () => any;
	formatError: (token: never) => string;
	has: (tokenType: string) => boolean;
}

export const lexer: Lexer = moo.compile({
	[TokenTypes.WS]: /[ \t]+/,
	[TokenTypes.String]: {
		match: /".*?"/,
		value: (txt: string) => txt.slice(1, -1),
	},
	[TokenTypes.Number]: /0|[1-9][0-9]*/,
	[TokenTypes.LParen]: "(",
	[TokenTypes.RParen]: ")",
	[TokenTypes.CBraceL]: "{",
	[TokenTypes.CBraceR]: "}",
	[TokenTypes.ListSeperator]: ",",
	[TokenTypes.BinaryAdditionOperator]: [
		BinaryOperators.Addition,
		BinaryOperators.Substraction,
	],
	[TokenTypes.BinaryMultiplicationOperator]: [
		BinaryOperators.Modulo,
		BinaryOperators.Multiplication,
		BinaryOperators.Division,
	],
	[TokenTypes.AssignmentOperator]: "=",
	[TokenTypes.Identifier]: {
		match: /[a-zA-Z][\w]*/,
		type: moo.keywords({
			[TokenTypes.FunctionKeyword]: "fun",
			[TokenTypes.MutableKeyword]: "mut",
			[TokenTypes.ReturnKeyword]: "return",
		}),
	},
	[TokenTypes.NL]: { match: /\n/, lineBreaks: true },
	[TokenTypes.NoMatch]: { error: true },
});
