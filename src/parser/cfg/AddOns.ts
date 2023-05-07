import { BaseSymbol, NearleyRule, NearleySymbol, Processor } from "./types.ts";

export abstract class AddOnSymbol {
	constructor(public symbol: BaseSymbol) {}

	abstract transform(
		name: string,
		symbol: NearleySymbol,
		addOnNumber: number
	): {
		rules: NearleyRule[];
		name: string;
	} 

	protected generateName(name: string, orderNumber: number) {
		return `${name}$ebnf$${orderNumber.toString()}`;
	}
}

export class OptionalSymbol extends AddOnSymbol {
	constructor(public symbol: BaseSymbol) {
		super(symbol);
	}

	transform(name: string, symbol: NearleySymbol, addOnNumber: number) {
		name = this.generateName(name, addOnNumber);

		return {
			name,
			rules: [
				{
					postprocess: () => symbol,
					name,
					symbols: [symbol],
				},
				{
					postprocess: () => null,
					name,
					symbols: [],
				},
			],
		};
	}
}

export class OneOrMoreSymbol extends AddOnSymbol {
	constructor(public symbol: BaseSymbol) {
		super(symbol);
	}

	transform(name: string, symbol: NearleySymbol, addOnNumber: number) {
		name = this.generateName(name, addOnNumber);

		return {
			name,
			rules: [
				{
					postprocess: (sym: any, other: any) => {
						return [sym, ...other];
					},
					name,
					symbols: [symbol, name],
				},
				{
					postprocess: (sym: any) => {
						return [sym];
					},
					name,
					symbols: [symbol],
				},
			],
		};
	}
}

export class ZeroOrMoreSymbol extends AddOnSymbol {
	constructor(public symbol: BaseSymbol) {
		super(symbol);
	}

	transform(name: string, symbol: NearleySymbol, addOnNumber: number) {
		name = this.generateName(name, addOnNumber);

		return {
			name,
			rules: [
				{
					postprocess: (sym: any, other: any) => {
						return [sym, ...other];
					},
					name,
					symbols: [symbol, name],
				},
				{
					postprocess: () => {
						return [];
					},
					name,
					symbols: [],
				},
			],
		};
	}
}


export const OPTIONAL = (symbol: BaseSymbol) => {
	return new OptionalSymbol(symbol);
};
export const ONE_OR_MORE = (symbol: BaseSymbol) => {
	return new OneOrMoreSymbol(symbol);
};
export const ZERO_OR_MORE = (symbol: BaseSymbol) => {
	return new ZeroOrMoreSymbol(symbol);
};
