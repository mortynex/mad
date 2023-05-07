import { Identifier, StatementTypes } from "../../parser/ast.ts";
import { mkFalse, mkTrue } from "../values/factories.ts";
import { Value } from "../values/values.ts";
import { ScopeRecord } from "./record.ts";
import { Scope } from "./scope.ts";

const mkIdentifier = (name: string): Identifier => ({
	type: StatementTypes.Identifier,
	name,
});

export const createGlobalScope = () => {
	const scope = new Scope();

	const assignGlobalVariable = (name: string, value: Value) => {
		scope.assign(mkIdentifier(name), new ScopeRecord({}));
	};

	assignGlobalVariable("false", mkFalse());
	assignGlobalVariable("true", mkTrue());

	return scope;
};