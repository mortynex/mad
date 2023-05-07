import { Identifier, StatementTypes } from "../../parser/ast.ts";
import { mkFalse, mkNativeFunction, mkTrue } from "../values/factories.ts";
import { transformValue } from "../values/transformers.ts";
import { Booleans, Value } from "../values/values.ts";
import { ScopeRecord } from "./record.ts";
import { Scope } from "./scope.ts";

const mkIdentifier = (name: string): Identifier => ({
	type: StatementTypes.Identifier,
	name,
});

export const createGlobalScope = () => {
	const scope = new Scope();

	const assignGlobalVariable = (name: string, value: Value) => {
		scope.assign(
			mkIdentifier(name),
			new ScopeRecord(value, { mutable: false })
		);
	};

	assignGlobalVariable(Booleans.False, mkFalse());
	assignGlobalVariable(Booleans.True, mkTrue());

	assignGlobalVariable(
		"print",
		mkNativeFunction((args: Value[]) => {
			console.log(...args.map(transformValue));
		})
	);

	return scope;
};
