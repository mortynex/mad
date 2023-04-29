import {
	BinaryOperation,
	Identifier,
	NumberLiteral,
	Statement,
	StatementTypes,
	VariableAssignment,
	VariableDeclaration,
} from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import { Value } from "../values/values.ts";
import { evalBinaryOperation } from "./binaryOperations.ts";
import { evalIdentifier, evalNumberLiteral } from "./literals.ts";
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

		case StatementTypes.Identifier:
			return evalIdentifier(scope, stmt as Identifier);

		case StatementTypes.BinaryOperation:
			return evalBinaryOperation(scope, stmt as BinaryOperation);

		case StatementTypes.VariableDeclaration:
			return evalVariableDeclaration(scope, stmt as VariableDeclaration);

		case StatementTypes.VariableAssignment:
			return evalVariableAssignment(scope, stmt as VariableAssignment);

		default:
			throw new Error(`invalid statement "${StatementTypes[stmt.type]}"`);
	}
};
