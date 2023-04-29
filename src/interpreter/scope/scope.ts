import { Identifier } from "../../parser/ast.ts";
import { Value } from "../values/values.ts";

export class Scope {
	constructor(public parentScope?: Scope) {}

	private env = new Map<string, Value>();

	has(id: Identifier): boolean {
		return this.env.has(id.name) ?? this.parentScope?.has(id);
	}

	resolve(id: Identifier): Value | undefined {
		return this.env.get(id.name) ?? this.parentScope?.resolve(id);
	}

	assign(id: Identifier, value: Value) {
		this.env.set(id.name, value);

		return this;
	}
}
