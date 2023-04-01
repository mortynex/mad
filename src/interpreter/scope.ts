import { Identifier } from "../parser/ast.ts";
import { Value } from "./values.ts";

export const createScope = (parent?: Scope): Scope => {
	const env = new Map<string, Value>();

	const has: Scope["has"] = (id: Identifier) => {
		return env.has(id.name) ?? parent?.has(id);
	};

	const resolve: Scope["resolve"] = (id: Identifier) => {
		const val = env.get(id.name) ?? parent?.resolve(id);

		return val;
	};

	const assign: Scope["assign"] = (id: Identifier, value: Value) => {
		env.set(id.name, value);
	};

	return { has, resolve, assign };
};

export type Scope = {
	has: (id: Identifier) => boolean;
	resolve: (id: Identifier) => Value | undefined;
	assign: (id: Identifier, value: Value) => void;
};
