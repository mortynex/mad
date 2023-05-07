import { TokenTypes } from "../../lexer/tokens.ts";
import { Program, Statement, StatementTypes } from "../ast.ts";
import { OPTIONAL, ZERO_OR_MORE } from "../cfg/AddOns.ts";
import { Grammar } from "../cfg/Grammar.ts";

enum rulesTypes {
	// helpers.ts
	_, // optional whitespace
	__, // required whitespace
	_ml, // optional multiline whitespace
	__ml, // required multiline whitespace
	__lb, // required linebreak
	$WS_then_NL,
	$WS_or_NL,

	// main.ts
	Line,
	Program,

	// statements.ts
	Statement,

	// expressions.ts
	NumberLiteral,
	Expression,
	Identifier,
	StringLiteral,
	Parens,
	$Basic,

	// variables.ts
	VariableDeclaration,
	VariableAssignment,

	// binary_operations.ts
	Addition,
	Multiplication,

	// functions.ts
	FunctionCall,
	FunctionDeclaration,
	FunctionCallArgs,
}

export const grammar = new Grammar<Statement | null>();

export const rules = grammar.useRules(rulesTypes);

grammar.setStartingRule(rules.Program);

export const none = () => null;
export const id = (...args: any[]) => args[0];
export const at =
	(atIndex: number) =>
	(...args: any[]) =>
		args[atIndex];

rules.Program(
	[rules._ml, rules.Statement, ZERO_OR_MORE(rules.Line), rules._ml],
	(_, first: Statement): Program => {
		return {
			type: StatementTypes.Program,
			body: [first],
		};
	}
);

rules.Line([rules.__lb, rules.Statement], at(1));
