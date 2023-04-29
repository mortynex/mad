import { Program } from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import { mkNull } from "../values/factories.ts";
import { Value } from "../values/values.ts";
import { evaluate } from "./main.ts";

export const evalProgram = (
	scope: Scope,
	program: Program,
	createNewScope: boolean = true
) => {
	const childScope = createNewScope ? scope.createChildScope() : scope;

	let result: Value = mkNull();

	for (const stmt of program.body) {
		const value = evaluate(childScope, stmt);

		if (value) {
			result = value;
		}
	}

	return result;
};
