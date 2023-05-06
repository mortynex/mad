import { VariableAssignment, VariableDeclaration } from "../../parser/ast.ts";
import { ScopeRecord } from "../scope/record.ts";
import { Scope } from "../scope/scope.ts";
import { mkNull } from "../values/factories.ts";
import { evaluate, EvaluateFunction } from "./main.ts";

export const evalVariableDeclaration: EvaluateFunction<VariableDeclaration> = (
	scope: Scope,
	{ id, value }: VariableDeclaration
) => {
	if (scope.has(id)) {
		throw new Error(`cannot redeclare name "${id.name}"`);
	}

	scope.assign(id, new ScopeRecord(evaluate(scope, value), { mutable: false }));

	return mkNull();
};

export const evalVariableAssignment: EvaluateFunction<VariableAssignment> = (
	scope: Scope,
	{ id, value }: VariableAssignment
) => {
	if (!scope.has(id)) {
		throw new Error(`cannot assign to undeclared name "${id.name}"`);
	}

	const varValue = evaluate(scope, value);

	scope.resolve(id)?.changeValue(varValue);

	return varValue;
};
