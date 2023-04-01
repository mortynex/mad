import {
	Statement,
	StatementTypes,
	Expression,
	NumberLiteral,
	Program,
	VariableAssignment,
	VariableDeclaration,
	Identifier,
} from "./ast.ts";
import { formatError, Token, TokenTypes } from "../lexer.ts";
import { ValueTypes } from "../interpreter/values.ts";

const createParser = () => {
	let tokens: Token[] = [];
	let currentIndex = 0;

	const eat = () => tokens[currentIndex++];
	const at = () => tokens[currentIndex];

	const peek = (ahead: number) => tokens[currentIndex + ahead];

	const save = () => {
		return {
			index: currentIndex,
		};
	};

	const restore = (atIndex: { index: number } = { index: 0 }) => {
		currentIndex = atIndex.index;
	};

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
		throw new SyntaxError(
			formatError(
				token || at(),
				"Unexpected token expected " +
					(TokenTypes[token?.type ?? -1] ?? "nothing") +
					" but instead got " +
					TokenTypes[at().type]
			)
		);
	};

	return { reset, expect, eat, at, throwUnexpected, peek, save, restore };
};

// global parser
const parser = createParser();

export const parse = (tokens: Token[]): Program => {
	parser.reset(tokens);

	const body: (Statement | null)[] = [];

	while (parser.at().type !== TokenTypes.EOF) {
		body.push(parseStatement());

		if (
			parser.at().type !== TokenTypes.NL &&
			parser.at().type !== TokenTypes.EOF
		) {
			throw new SyntaxError(
				formatError(parser.at(), "More than one statement on one line")
			);
		}
	}

	return {
		type: StatementTypes.Program,
		// @ts-ignore
		body: body.filter((stmt) => stmt),
	};
};

// Order of precedence
// --
// Additition
// Multiplication
// Literals and Parenthes

const parseWS = (optional: boolean = true) => {
	if (optional) {
		if (parser.at().type !== TokenTypes.WS) {
			return;
		}
	}

	parser.expect(TokenTypes.WS);
	parser.eat();
};

const parseStatement = () => {
	switch (parser.at().type) {
		case TokenTypes.ValueType:
			return parseVariableDeclaration();

		case TokenTypes.Identifier:
			const state = parser.save();

			parser.eat();

			parseWS(true);

			const nextTokenType = parser.at().type;

			parser.restore(state);

			switch (nextTokenType) {
				case TokenTypes.AssignmentOperator:
					return parseVariableAssignment();
				default:
					return parseExpression();
			}

		default:
			return parseExpression();
	}
};

const parseVariableAssignment = (): VariableAssignment | Identifier => {
	const id = parseIdentifier();

	parseWS(true);

	if (parser.at().type !== TokenTypes.AssignmentOperator) {
		return id;
	}

	parser.eat();

	parseWS(true);

	const value = parseExpression();

	return {
		type: StatementTypes.VariableAssignment,
		id,
		value,
	};
};

const parseVariableDeclaration = (): VariableDeclaration => {
	const type = parser.eat();

	parseWS(false);

	const { id, value } = parseVariableAssignment() as VariableAssignment;

	return {
		type: StatementTypes.VariableDeclaration,
		value,
		id,
		variableType: type.value as ValueTypes,
	};
};

const parseExpression = () => {
	return parseAddition();
};

const parseAddition = () => {
	let left: Statement = parseMultiplication();

	while (true) {
		parseWS();
		// kdyz odstranim tenhle koment tak to prestane fungovat (nechapu)
		if (parser.at().type !== TokenTypes.BinaryAdditionOperator) {
			break;
		}

		const { value: operator } = parser.eat();

		parseWS();

		const op = {
			type: StatementTypes.BinaryOperation,
			left: left,
			right: parseMultiplication(),
			operator,
		};

		left = op;
	}

	return left;
};

const parseMultiplication = () => {
	let left: Statement = parseLiteral();

	while (true) {
		parseWS();
		// kdyz odstranim tenhle koment tak to prestane fungovat (nechapu)
		if (parser.at().type !== TokenTypes.BinaryMultiplicationOperator) {
			break;
		}

		const { value: operator } = parser.eat();

		parseWS();

		const op = {
			type: StatementTypes.BinaryOperation,
			left: left,
			right: parseLiteral(),
			operator,
		};

		left = op;
	}

	return left;
};

const parseLiteral = () => {
	parseWS();

	switch (parser.at().type) {
		case TokenTypes.Number:
			const { value } = parser.eat();

			return {
				type: StatementTypes.NumberLiteral,
				value,
			};

		case TokenTypes.LParen:
			parser.eat();

			const body = parseExpression();

			parser.expect(TokenTypes.RParen);

			parser.eat();

			return body;

		case TokenTypes.Identifier:
			return parseIdentifier();

		default:
			parser.throwUnexpected();
	}

	throw new Error();
};

const parseIdentifier = (): Identifier => {
	parser.expect(TokenTypes.Identifier);
	const { value: name } = parser.eat();

	return {
		type: StatementTypes.Identifier,
		name,
	};
};
