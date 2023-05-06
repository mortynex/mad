import { Identifier } from "../../parser/ast.ts";
import { Value } from "../values/values.ts";
import { ScopeRecord } from "./record.ts";

export class Scope {
	constructor(public parentScope?: Scope) {}

	private env = new Map<string, ScopeRecord>();

	has(id: Identifier): boolean {
		return this.env.has(id.name) ?? this.parentScope?.has(id);
	}

	resolve(id: Identifier): ScopeRecord | undefined {
		return this.env.get(id.name) ?? this.parentScope?.resolve(id);
	}

	assign(id: Identifier, value: ScopeRecord): ScopeRecord {
		this.env.set(id.name, value);

		return value;
	}

	createChildScope() {
		return new Scope(this);
	}
}
