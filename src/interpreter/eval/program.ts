import { Program } from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import { mkNull } from "../values/factories.ts";
import { Value } from "../values/values.ts";
import { evaluate } from "./main.ts";

export const evalProgram = (scope: Scope, program: Program) => {
	let result: Value | null = null;

	for (const stmt of program.body) {
		result = evaluate(scope, stmt);
	}

	return result ?? mkNull();
};
