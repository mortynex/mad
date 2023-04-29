import { Identifier, NumberLiteral } from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import { mkNumber } from "../values/factories.ts";
import { EvaluateFunction } from "./main.ts";

export const evalNumberLiteral: EvaluateFunction<NumberLiteral> = (
	scope: Scope,
	token: NumberLiteral
) => {
	const value = Number(token.value);

	return mkNumber(value);
};

export const evalIdentifier: EvaluateFunction<Identifier> = (
	scope: Scope,
	token: Identifier
) => {
	const value = scope.resolve(token);

	if (!value) {
		throw new Error("use of undefined variable");
	}

	return value;
};
