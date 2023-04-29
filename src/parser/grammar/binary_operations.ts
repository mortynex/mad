import { BinaryOperator } from "../../constants.ts";
import { Token, TokenTypes } from "../../lexer/tokens.ts";
import { BinaryOperation, Expression, StatementTypes } from "../ast.ts";
import { id, rules } from "./main.ts";

const BinaryAdditionProcessor = (
	left: Expression,
	_: any,
	operator: Token,
	__: any,
	right: Expression
): BinaryOperation => {
	return {
		type: StatementTypes.BinaryOperation,
		left,
		operator: operator.value as BinaryOperator,
		right,
	};
};

rules.Addition(
	[
		rules.Multiplication,
		rules._,
		TokenTypes.BinaryAdditionOperator,
		rules._,
		rules.Addition,
	],
	BinaryAdditionProcessor
);
rules.Addition([rules.Multiplication], id);

rules.Multiplication(
	[
		rules.Basic,
		rules._,
		TokenTypes.BinaryMultiplicationOperator,
		rules._,
		rules.Multiplication,
	],
	BinaryAdditionProcessor
);
rules.Multiplication([rules.Basic], id);
