import { BinaryOperator } from "../../interpreter/values.ts";
import { Token, TokenTypes } from "../../lexer/tokens.ts";
import {
	BinaryOperation,
	Expression,
	Identifier,
	NumberLiteral,
	Program,
	Statement,
	StatementTypes,
	VariableAssignment,
	VariableDeclaration,
} from "../ast.ts";
import { ONE_OR_MORE, OPTIONAL, ZERO_OR_MORE } from "../cfg/AddOns.ts";
import { Grammar } from "../cfg/Grammar.ts";

enum rulesTypes {
	_,
	__,
	Line,
	Statement,
	Program,
	NumberLiteral,
	Expression,
	VariableDeclaration,
	VariableAssignment,
	Identifier,
	Addition,
	Multiplication,
	Parens,
	Basic,
}

export const grammar = new Grammar<Statement | null>();

export const rules = grammar.useRules(rulesTypes);

export const none = () => null;
export const id = (...args: any[]) => args[0];
export const at =
	(atIndex: number) =>
	(...args: any[]) =>
		args[atIndex];

grammar.setStartingRule(rules.Program);

rules.Program([ZERO_OR_MORE(rules.Line)], (lines): Program => {
	return {
		type: StatementTypes.Program,
		body: lines,
	};
});

rules.Line([rules._, rules.Statement, rules._, OPTIONAL(TokenTypes.WS)], at(1));
