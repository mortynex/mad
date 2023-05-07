import { BinaryOperator } from "../../lexer/tokens.ts";
import { BinaryOperation } from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import { mkNumber, mkString } from "../values/factories.ts";
import { NumberValue, StringValue, ValueType } from "../values/values.ts";
import { evaluate, EvaluateFunction } from "./main.ts";

export const evalBinaryOperation: EvaluateFunction<BinaryOperation> = (
	scope: Scope,
	operation: BinaryOperation
) => {
	const left = evaluate(scope, operation.left);
	const right = evaluate(scope, operation.right);

	if (!left?.type || left?.type !== right?.type) {
		throw new Error(
			"cannot perform binary operation on two different value types"
		);
	}

	const type = left.type;
	const operator = operation.operator;

	switch (type) {
		case ValueType.Number:
			return handleNumberBinaryOperation(
				left as NumberValue,
				right as NumberValue,
				operator
			);
		case ValueType.String:
			return handleStringBinaryOperation(
				left as StringValue,
				right as StringValue,
				operator
			);

		default:
			throw new Error("invalid use of binary operator");
	}
};

const handleNumberBinaryOperation = (
	left: NumberValue,
	right: NumberValue,
	operator: BinaryOperator
): NumberValue => {
	switch (operator) {
		case BinaryOperator.Addition:
			return mkNumber(left.value + right.value);

		case BinaryOperator.Multiplication:
			return mkNumber(left.value * right.value);

		case BinaryOperator.Division:
			return mkNumber(left.value / right.value);

		case BinaryOperator.Substraction:
			return mkNumber(left.value - right.value);

		case BinaryOperator.Modulo:
			return mkNumber(left.value % right.value);

		default:
			throw new Error(`Cannot use operator "${operator}" on number values`);
	}
};

const handleStringBinaryOperation = (
	left: StringValue,
	right: StringValue,
	operator: BinaryOperator
): StringValue => {
	switch (operator) {
		case BinaryOperator.Addition:
			return mkString(left.value + right.value);

		default:
			throw new Error(`Cannot use operator "${operator}" on string values`);
	}
};
