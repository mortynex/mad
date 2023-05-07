import { Identifier, NumberLiteral, StringLiteral } from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import { mkNumber, mkString } from "../values/factories.ts";
import { EvaluateFunction } from "./main.ts";

export const evalNumberLiteral: EvaluateFunction<NumberLiteral> = (
	scope: Scope,
	token: NumberLiteral
) => {
	const value = Number(token.value);

	return mkNumber(value);
};

export const evalStringLiteral: EvaluateFunction<StringLiteral> = (
	scope: Scope,
	{ value }: StringLiteral
) => {
	return mkString(value);
};

export const evalIdentifier: EvaluateFunction<Identifier> = (
	scope: Scope,
	token: Identifier
) => {
	const record = scope.resolve(token);

	if (!record) {
		throw new Error("use of undefined variable");
	}

	return record.value;
};
