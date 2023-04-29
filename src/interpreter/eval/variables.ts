import { VariableAssignment, VariableDeclaration } from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import { mkNull } from "../values/factories.ts";
import { evaluate, EvaluateFunction } from "./main.ts";

export const evalVariableDeclaration: EvaluateFunction<VariableDeclaration> = (
	scope: Scope,
	{ id, value }: VariableDeclaration
) => {
	scope.assign(id, evaluate(scope, value));

	return mkNull();
};

export const evalVariableAssignment: EvaluateFunction<VariableAssignment> = (
	scope: Scope,
	{ id, value }: VariableAssignment
) => {
	if (!scope.has(id)) {
		throw new Error(`cannot find name "${id.name}"`);
	}

	const varValue = evaluate(scope, value);

	scope.assign(id, varValue);

	return varValue;
};
