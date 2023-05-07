import { InterpreterError } from "../../errors.ts";
import { VariableAssignment, VariableDeclaration } from "../../parser/ast.ts";
import { ScopeRecord } from "../scope/record.ts";
import { Scope } from "../scope/scope.ts";
import { mkNull } from "../values/factories.ts";
import { evaluate, EvaluateFunction } from "./main.ts";

export const evalVariableDeclaration: EvaluateFunction<VariableDeclaration> = (
	scope: Scope,
	declaration: VariableDeclaration
) => {
	const { id, value } = declaration;

	if (scope.has(id)) {
		throw new InterpreterError(
			declaration,
			`cannot redeclare name "${id.name}"`
		);
	}

	scope.assign(id, new ScopeRecord(evaluate(scope, value), { mutable: false }));

	return mkNull();
};

export const evalVariableAssignment: EvaluateFunction<VariableAssignment> = (
	scope: Scope,
	assignment: VariableAssignment
) => {
	const { id, value } = assignment;

	if (!scope.has(id)) {
		throw new InterpreterError(
			assignment,
			`cannot assign to undeclared name "${id.name}"`
		);
	}

	const varValue = evaluate(scope, value);

	scope.resolve(id)?.changeValue(varValue);

	return varValue;
};
