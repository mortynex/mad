import moo from "npm:moo";
import { BinaryOperators, ValueTypes } from "./interpreter/values.ts";

export enum TokenTypes {
	LParen,
	RParen,

	Number,
	String,

	BinaryAdditionOperator,
	BinaryMultiplicationOperator,
	AssignmentOperator,
	Identifier,
	ValueType,
	FunctionKeyword,
	// whitespaces\
	WS,
	NL,
	// special tokens
	EOF,
	NoMatch,
}

const keywords: Record<string, string[] | string> = {
	[TokenTypes.ValueType]: [ValueTypes.Number, ValueTypes.String],
};

export interface Token {
	value: string;
	type: TokenTypes;
	line: number;
	col: number;
}

const lexer = moo.compile({
	[TokenTypes.WS]: /[ \t]+/,
	[TokenTypes.String]: {
		match: /".*?"/,
		value: (txt: string) => txt.slice(1, -1),
	},
	[TokenTypes.Number]: /0|[1-9][0-9]*/,
	[TokenTypes.LParen]: "(",
	[TokenTypes.RParen]: ")",
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
	},
	[TokenTypes.NL]: { match: /\n/, lineBreaks: true },
	[TokenTypes.NoMatch]: { error: true },
});

const keywordTypeMap = new Map<string, number>();

for (let [type, kws] of Object.entries(keywords)) {
	const fixedType = Number(type);

	const setKeyword = (kw: string) => keywordTypeMap.set(kw, fixedType);

	if (!Array.isArray(kws)) setKeyword(kws);

	for (const poss of kws) {
		keywordTypeMap.set(poss, Number(type));
	}
}

export const tokenize = (str: string) => {
	lexer.reset(str);

	const transformToken = (token: any) => {
		let { type, col, value, line } = token;

		// convert back to number cuz js converts number object keys to string
		type = Number(token);

		// check if theres invalid token
		if (type === TokenTypes.NoMatch) {
			throw new SyntaxError(formatError(token, "Invalid syntax")); // TODO: add better error messages
		}

		// convert keywords to the right type
		if (type === TokenTypes.Identifier) {
			const newType = keywordTypeMap.get(value);

			if (newType) {
				type = newType;
			}
		}

		return {
			type: type,
			value: value,
			col,
			line,
		};
	};

	const tokens = Array.from(lexer).map(transformToken);

	tokens.push({
		type: TokenTypes.EOF,
		value: "<EOF>",
		col: lexer.col,
		line: lexer.line,
	});

	return tokens;
};

export const formatError: (token: Token, text: string) => string =
	lexer.formatError.bind(lexer);
