import { InterpreterError } from "../../errors.ts";
import {
	BinaryOperation,
	FunctionCall,
	Identifier,
	NumberLiteral,
	Statement,
	StatementTypes,
	StringLiteral,
	VariableAssignment,
	VariableDeclaration,
} from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import { Value } from "../values/values.ts";
import { evalBinaryOperation } from "./binaryOperations.ts";
import { evalFunctionCall } from "./functions.ts";
import {
	evalIdentifier,
	evalNumberLiteral,
	evalStringLiteral,
} from "./literals.ts";
import {
	evalVariableAssignment,
	evalVariableDeclaration,
} from "./variables.ts";

export type EvaluateFunction<Token extends Statement = Statement> = (
	scope: Scope,
	token: Token
) => Value;

export const evaluate: EvaluateFunction = (scope: Scope, stmt: Statement) => {
	switch (stmt.type) {
		case StatementTypes.NumberLiteral:
			return evalNumberLiteral(scope, stmt as NumberLiteral);

		case StatementTypes.StringLiteral:
			return evalStringLiteral(scope, stmt as StringLiteral);

		case StatementTypes.Identifier:
			return evalIdentifier(scope, stmt as Identifier);

		case StatementTypes.BinaryOperation:
			return evalBinaryOperation(scope, stmt as BinaryOperation);

		case StatementTypes.VariableDeclaration:
			return evalVariableDeclaration(scope, stmt as VariableDeclaration);

		case StatementTypes.VariableAssignment:
			return evalVariableAssignment(scope, stmt as VariableAssignment);

		case StatementTypes.FunctionCall:
			return evalFunctionCall(scope, stmt as FunctionCall);

		default:
			throw new InterpreterError(
				stmt,
				`Internal Error: Statement type ["${
					StatementTypes[stmt.type]
				}"] is missing an implementation`
			);
	}
};
