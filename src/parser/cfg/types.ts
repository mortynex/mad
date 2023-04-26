import { Token } from "../../lexer/tokens.ts";
import { OneOrMoreSymbol, OptionalSymbol, ZeroOrMoreSymbol } from "./AddOns.ts";

export interface NearleyToken {
	value: any;
	[key: string]: any;
}

export interface NearleyLexer {
	reset: (chunk: string, info: any) => void;
	next: () => NearleyToken | undefined;
	save: () => any;
	formatError: (token: never) => string;
	has: (tokenType: string) => boolean;
}

export interface NearleyRule {
	name: string;
	symbols: NearleySymbol[];
	postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

export type NearleySymbol = string | { type: string };

export interface NearleyGrammar {
	Lexer: NearleyLexer | undefined;
	ParserRules: NearleyRule[];
	ParserStart: string;
}

export type Processor<ReturnType = any> = (...args: any[]) => ReturnType;

export type Rule = {
	symbols: GrammarSymbol[];
	processor: Processor;
};

export type RuleID = {
	type: "rule";
	ruleId: string;
};

export type BaseSymbol =
	| RuleID
	| Terminal
	| ((symbols: GrammarSymbol[], processor: Processor<any>) => undefined);

export type Terminal = number;

export type GrammarSymbol =
	| BaseSymbol
	| OptionalSymbol
	| ZeroOrMoreSymbol
	| OneOrMoreSymbol;

export type transformSymbolsIntoArgs<
	ruleReturnType,
	Symbols extends GrammarSymbol[]
> = Symbols extends RuleID ? ruleReturnType : Token;
