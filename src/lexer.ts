import moo from "npm:moo";

export enum TokenTypes {
	LParen,
	RParen,
	Number,
	BinaryOperator,
	WS,
	NoMatch,
	NL,
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
	[TokenTypes.BinaryOperator]: ["+", "-"],
	[TokenTypes.NL]: { match: /\n/, lineBreaks: true },
	[TokenTypes.NoMatch]: { error: true },
});

export const tokenize = (str: string) => {
	lexer.reset(str);

	let prefetchedToken: Token | null = null;

	const transformToken = (token: any) => {
		const { type, col, value, line } = token;

		if (Number(type) === TokenTypes.NoMatch) {
			throw new SyntaxError(formatError(token, "Invalid syntax"));
		}

		return {
			type: Number(type),
			value: value,
			col,
			line,
		};
	};

	const next = (): Token => {
		if (prefetchedToken !== null) {
			const nextToken = prefetchedToken;

			prefetchedToken = null;

			return nextToken;
		}

		const token = lexer.next();

		return transformToken(token);
	};

	const at = () => {
		if (prefetchedToken) return prefetchedToken;

		prefetchedToken = next();

		return prefetchedToken;
	};

	const array = (): Token[] => {
		return Array.from(lexer).map(transformToken);
	};

	return { next, array, at };
};

export type tokenizer = ReturnType<typeof tokenize>;

export const formatError: (token: Token, text: string) => string =
	lexer.formatError.bind(lexer);
