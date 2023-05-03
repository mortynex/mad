import { Identifier } from "../../parser/ast.ts";
import { Value } from "../values/values.ts";
import { ScopeRecord } from "./record.ts";
import { ScopeType } from "./types.ts";

export class Scope {
	public global = false;

	constructor(public type: ScopeType, public parentScope?: Scope) {}

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

	createChildScope(type: ScopeType) {
		return new Scope(type, this);
	}
}
