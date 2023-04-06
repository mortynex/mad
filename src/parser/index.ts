import {
	Statement,
	StatementTypes,
	Expression,
	NumberLiteral,
	Program,
	VariableAssignment,
	VariableDeclaration,
	Identifier,
	StatementLocation,
} from "./ast.ts";
import { formatTokenError, Token, TokenTypes } from "../lexer.ts";
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
			formatTokenError(
				token || at(),
				"Unexpected token, expected " +
					(TokenTypes[token?.type ?? -1] ?? "nothing") +
					" but instead got " +
					TokenTypes[at().type]
			)
		);
	};

	return { reset, expect, eat, at, throwUnexpected, peek, save, restore };
};

const formatStatementError = (stmt: Statement) => {};

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
				formatTokenError(parser.at(), "Expected end of line")
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
		start: id.start,
		end: value.end,
	};
};

const parseVariableDeclaration = (): VariableDeclaration => {
	const type = parser.eat();

	parseWS(false);

	const { id, value, end } = parseVariableAssignment() as VariableAssignment;

	return {
		type: StatementTypes.VariableDeclaration,
		value,
		id,
		variableType: type.value as ValueTypes,
		start: createLocationsFromToken(type).start,
		end,
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

		const right = parseMultiplication();

		const op = {
			type: StatementTypes.BinaryOperation,
			left: left,
			right,
			operator,
			start: left.start,
			end: right.end,
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

		const rightSide = parseLiteral();

		const op = {
			type: StatementTypes.BinaryOperation,
			left: left,
			right: rightSide,
			operator,
			start: left.start,
			end: rightSide.end,
		};

		left = op;
	}

	return left;
};

const createLocationsFromToken = ({
	text,
	col,
	line,
}: Token): { start: StatementLocation; end: StatementLocation } => {
	return {
		start: {
			line,
			col,
		},
		end: {
			col: col + text.length,
			line,
		},
	};
};

const parseLiteral = () => {
	parseWS();

	switch (parser.at().type) {
		case TokenTypes.Number: {
			const { value } = parser.eat();

			return {
				type: StatementTypes.NumberLiteral,
				value,
				...createLocationsFromToken(parser.peek(-1)),
			};
		}

		case TokenTypes.LParen:
			parser.eat();

			const body = parseExpression();

			parser.expect(TokenTypes.RParen);

			parser.eat();

			return body;

		case TokenTypes.Identifier:
			return parseIdentifier();

		case TokenTypes.String: {
			const { value, col, line } = parser.eat();

			return {
				type: StatementTypes.StringLiteral,
				value,
				...createLocationsFromToken(parser.peek(-1)),
			};
		}

		default:
			parser.throwUnexpected();
	}

	throw new Error();
};

const parseIdentifier = (): Identifier => {
	parser.expect(TokenTypes.Identifier);
	const { value: name, col, line } = parser.eat();

	return {
		type: StatementTypes.Identifier,
		name,
		...createLocationsFromToken(parser.peek(-1)),
	};
};
