import { Token, TokenTypes } from "../lexer/tokens.ts";
import { NumberLiteral, Program, Statement, StatementTypes } from "./ast.ts";
import { ONE_OR_MORE, OPTIONAL, ZERO_OR_MORE } from "./cfg/AddOns.ts";
import { Grammar } from "./cfg/Grammar.ts";

enum test {
	_,
	__,
	Line,
	Statement,
	Program,
	NumberLiteral,
	LiteralValue,
}

export const grammar = new Grammar<Statement | null>();

const rules = grammar.useRules(test);

const none = () => null;
const id = (...args: any[]) => args[0];
const at =
	(atIndex: number) =>
	(...args: any[]) =>
		args[atIndex];

grammar.setStartingRule(rules.Program);

rules.Program([ZERO_OR_MORE(rules.Line)], (lines): Program => {
	console.log({ lines });

	return {
		type: StatementTypes.Program,
		body: lines,
	};
});

rules.Line([rules._, rules.Statement, rules._, OPTIONAL(TokenTypes.WS)], at(1));

rules.Statement([rules.LiteralValue], id);

rules.LiteralValue([rules.NumberLiteral], id);

rules.NumberLiteral(
	[TokenTypes.Number, rules._],
	(number: Token): NumberLiteral => ({
		type: StatementTypes.NumberLiteral,
		value: number.value,
	})
);

// optional whitespace
rules._([ZERO_OR_MORE(TokenTypes.WS)], none);
// mandatory whitespace
rules.__([ONE_OR_MORE(TokenTypes.WS)], none);
