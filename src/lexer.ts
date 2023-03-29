import moo from "npm:moo";

export enum BinaryOperator {
	Addition = "+",
	Substraction = "-",
	Multiplication = "*",
	Division = "/",
	Modulo = "%",
}

export enum TokenTypes {
	LParen,
	RParen,
	Number,
	BinaryAdditionOperator,
	BinaryMultiplicationOperator,
	// whitespaces
	WS,
	NL,
	// special tokens
	EOF,
	NoMatch,
}

export interface Token {
	value: string;
	type: TokenTypes;
	line: number;
	col: number;
}

const lexer = moo.compile({
	[TokenTypes.WS]: /[ \t]+/,
	[TokenTypes.Number]: /0|[1-9][0-9]*/,
	[TokenTypes.LParen]: "(",
	[TokenTypes.RParen]: ")",
	[TokenTypes.BinaryAdditionOperator]: [
		BinaryOperator.Addition,
		BinaryOperator.Substraction,
	],
	[TokenTypes.BinaryMultiplicationOperator]: [
		BinaryOperator.Modulo,
		BinaryOperator.Multiplication,
		BinaryOperator.Division,
	],
	[TokenTypes.NL]: { match: /\n/, lineBreaks: true },
	[TokenTypes.NoMatch]: { error: true },
});

export const tokenize = (str: string) => {
	lexer.reset(str);

	const transformToken = (token: any) => {
		const { type, col, value, line } = token;

		if (Number(type) === TokenTypes.NoMatch) {
			throw new SyntaxError(formatError(token, "Invalid syntax")); // TODO: add better error messages
		}

		return {
			type: Number(type),
			value: value,
			col,
			line,
		};
	};

	const tokens = Array.from(lexer).map(transformToken);

	tokens.push({
		type: TokenTypes.EOF,
		value: "<eof>",
		col: lexer.col,
		line: lexer.line,
	});

	return tokens;
};

export const formatError: (token: Token, text: string) => string =
	lexer.formatError.bind(lexer);
