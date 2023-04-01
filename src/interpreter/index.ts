import { formatError } from "../lexer.ts";
import {
	BinaryOperation,
	Identifier,
	NumberLiteral,
	Program,
	Statement,
	StatementTypes,
	VariableAssignment,
	VariableDeclaration,
} from "../parser/ast.ts";
import { createScope, Scope } from "./scope.ts";
import { NumberValue, Value } from "./values.ts";

export const evaluate = (stmt: Statement, scope: Scope): Value => {
	switch (stmt.type) {
		case StatementTypes.NumberLiteral:
			return evalNumber(stmt as NumberLiteral);

		case StatementTypes.BinaryOperation:
			return evalBinaryOperation(stmt as BinaryOperation, scope);

		case StatementTypes.Program:
			return evalProgram(stmt as Program, scope);

		case StatementTypes.VariableDeclaration:
			return evalVariableDeclaration(stmt as VariableDeclaration, scope);

		case StatementTypes.VariableAssignment:
			return evalVariableAssignment(stmt as VariableAssignment, scope);

		case StatementTypes.Identifier:
			return evalIdentifier(stmt as Identifier, scope);

		default:
			throw new Error("statement eval missing"); // TODO: internal errors
	}
};

const evalVariableAssignment = (
	{ id, value: expr }: VariableAssignment,
	scope: Scope
) => {
	if (!scope.has(id)) {
		throw new Error("assignemnt to undeclared variable");
	}

	const value = evaluate(expr, scope);

	scope.assign(id, value);

	return value;
};

const evalVariableDeclaration = (
	{ id, value: expr, variableType }: VariableDeclaration,
	scope: Scope
) => {
	if (scope.has(id)) {
		throw new Error("can redeclare a variable");
	}

	const value = evaluate(expr, scope);

	scope.assign(id, value);

	return value;
};

const evalIdentifier = (id: Identifier, scope: Scope) => {
	const value = scope.resolve(id);

	if (!value) {
		throw new Error("Use of unassigned variable");
	}

	return value;
};

export const evalProgram = (
	program: Program,
	parentScope: Scope | undefined = undefined,
	createNewScope: boolean = true
) => {
	let val: Value = new NumberValue({ value: 0 }); // TODO: change this to nullish/undefined value

	const scope =
		!createNewScope && parentScope ? parentScope : createScope(parentScope);

	for (let statement of program.body) {
		val = evaluate(statement, scope);
	}

	return val;
};

const evalNumber = (numberToken: NumberLiteral) => {
	return new NumberValue({
		value: parseFloat(numberToken.value),
	});
};

const evalBinaryOperation = (
	{ operator, left, right }: BinaryOperation,
	scope: Scope
) => {
	const firstVal = evaluate(left, scope);
	const secondVal = evaluate(right, scope);

	return firstVal.handleBinaryOperation(operator, secondVal);
};
