import { TokenTypes } from "../../lexer/tokens.ts";
import { Program, Statement, StatementTypes } from "../ast.ts";
import { OPTIONAL, ZERO_OR_MORE } from "../cfg/AddOns.ts";
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
	StringLiteral
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
