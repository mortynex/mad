import { Value } from "../values/values.ts";

export class ScopeRecord {
	private val: Value;

	constructor(
		value: Value,
		private options: {
			mutable: boolean;
		}
	) {
		this.val = value;
	}

	changeValue(value: Value) {
		if (!this.options.mutable) {
			throw new Error("Cannot change value of immutable scope record");
		}

		this.val = value;
	}

	get value() {
		return this.val;
	}
}
