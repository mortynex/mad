import moo from "npm:moo";

enum TokenTypes {
	LParen,
	RParen,
	Number,
	BinaryOperator,
	WS,
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
	NL: { match: /\n/, lineBreaks: true },
});

export const tokenize = (str: string) => {
	lexer.reset(str);

	let prefetchedToken: Token | null = null;

	const next = (): Token => {
		if (prefetchedToken !== null) {
			const nextToken = prefetchedToken;

			prefetchedToken = null;

			return nextToken;
		}

		const { type, value, col, line } = lexer.next();

		return {
			type: Number(type),
			value: value,
			col,
			line,
		};
	};

	const at = () => {
		if (prefetchedToken) return prefetchedToken;

		prefetchedToken = next();

		return prefetchedToken;
	};

	const array = (): Token[] => {
		return Array.from(lexer);
	};

	return { next, array, at };
};

export type tokenizer = ReturnType<typeof tokenize>;
