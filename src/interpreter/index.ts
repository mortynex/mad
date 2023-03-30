import {
	BinaryOperation,
	NumberLiteral,
	Program,
	Statement,
	StatementTypes,
} from "../parser/ast.ts";
import { NumberValue, Value } from "./values.ts";

export const evaluate = (stmt: Statement): Value => {
	switch (stmt.type) {
		case StatementTypes.NumberLiteral:
			return evalNumber(stmt as NumberLiteral);

		case StatementTypes.BinaryOperation:
			return evalBinaryOperation(stmt as BinaryOperation);

		case StatementTypes.Program:
			return evalProgram(stmt as Program);

		default:
			throw new Error("statement eval missing"); // TODO: internal errors
	}
};

const evalProgram = (program: Program) => {
	let val: Value = new NumberValue({ value: 0 }); // TODO: change this to nullish/undefined value

	for (let statement of program.body) {
		val = evaluate(statement);
	}

	return val;
};

const evalNumber = (numberToken: NumberLiteral) => {
	return new NumberValue({
		value: parseFloat(numberToken.value),
	});
};

const evalBinaryOperation = ({ operator, left, right }: BinaryOperation) => {
	const firstVal = evaluate(left);
	const secondVal = evaluate(right);

	return firstVal.handleBinaryOperation(operator, secondVal);
};
