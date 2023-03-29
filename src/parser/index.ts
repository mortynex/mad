import {
	ASTNode,
	ASTTypes,
	Expression,
	NumberLiteral,
	Program,
} from "./ast.ts";
import { formatError, Token, TokenTypes } from "../lexer.ts";

const createParser = () => {
	let tokens: Token[] = [];
	let currentIndex = 0;

	const eat = () => tokens[currentIndex++];
	const at = () => tokens[currentIndex];

	const reset = (lexer: Token[]) => {
		tokens = lexer;
	};

	const expect = (expected: TokenTypes) => {
		if (at().type !== expected) {
			throwUnexpected();
		} else {
			return at();
		}
	};

	const throwUnexpected = (token?: Token) => {
		throw new SyntaxError(formatError(token || at(), "Unexpected token"));
	};

	const skipWhitespace = (optionalWS: boolean = true) => {
		if (optionalWS) {
			if (at().type !== TokenTypes.WS) {
				return;
			}
		}

		expect(TokenTypes.WS);
		eat();
	};

	return { reset, expect, eat, at, throwUnexpected, skipWhitespace };
};

// global parser
const parser = createParser();

export const parse = (tokens: Token[]): Program => {
	parser.reset(tokens);

	const body: (ASTNode | null)[] = [];

	while (parser.at().type !== TokenTypes.EOF) {
		body.push(parseStatement());
	}

	return {
		type: ASTTypes.Program,
		// @ts-ignore
		body: body.filter((stmt) => stmt),
	};
};

// Order of precedence
// --
// Literals

const parseStatement = () => {
	return parseLiterals();
};

const parseLiterals = (): NumberLiteral | null => {
	switch (parser.at().type) {
		case TokenTypes.Number:
			const { value } = parser.eat();

			return {
				type: ASTTypes.NumberLiteral,
				value,
			};
		default:
			parser.throwUnexpected();
	}

	return null;
};
