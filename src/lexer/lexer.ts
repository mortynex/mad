import moo from "npm:moo";
import { BinaryOperator } from "../constants.ts";
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
	[TokenTypes.LArgParen]: "{",
	[TokenTypes.RArgParen]: "}",
	[TokenTypes.LCodeBlockParen]: "[",
	[TokenTypes.RCodeBlockParen]: "]",
	[TokenTypes.BinaryAdditionOperator]: [
		BinaryOperator.Addition,
		BinaryOperator.Substraction,
	],
	[TokenTypes.BinaryMultiplicationOperator]: [
		BinaryOperator.Modulo,
		BinaryOperator.Multiplication,
		BinaryOperator.Division,
	],
	[TokenTypes.AssignmentOperator]: "=",
	[TokenTypes.Identifier]: {
		match: /[a-zA-Z][\w]*/,
		type: moo.keywords({
			[TokenTypes.FunctionKeyword]: "fun",
			[TokenTypes.ReturnKeyword]: "return",
			[TokenTypes.VariableDeclarationKeyword]: "let",
		}),
	},
	[TokenTypes.NL]: { match: /\r\n/, lineBreaks: true },
});
