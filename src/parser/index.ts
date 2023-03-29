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

	const peek = (ahead: number) => tokens[currentIndex + ahead];

	const reset = (tkns: Token[]) => {
		tokens = tkns;
		currentIndex = 0;
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

	const skipWhitespace = (optionalWS: boolean = true) => {};

	return { reset, expect, eat, at, throwUnexpected, skipWhitespace, peek };
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
// Additition
// Literals

const parseStatement = () => {
	return parseAddition();
};

const parseWS = (optional: boolean = true) => {
	if (optional) {
		if (parser.at().type !== TokenTypes.WS) {
			return;
		}
	}

	parser.expect(TokenTypes.WS);
	parser.eat();
};

const parseAddition = () => {
	let left: ASTNode = parseLiteral();

	while (true) {
		parseWS();
		// kdyz odstranim tenhle koment tak to prestane fungovat (nechapu)
		if (parser.at().type !== TokenTypes.BinaryAdditionOperator) {
			break;
		}

		const { value: operator } = parser.eat();

		parseWS();

		const op = {
			type: ASTTypes.BinaryOperation,
			left: left,
			right: parseLiteral(),
			operator,
		};

		left = op;
	}

	return left;
};

const parseLiteral = (): NumberLiteral => {
	parseWS();

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

	throw new Error();
};
