import { Lexer } from "../../lexer/lexer.ts";
import { AddOnSymbol } from "./AddOns.ts";
import {
	Rule,
	Processor,
	GrammarSymbol,
	NearleyGrammar,
	NearleySymbol,
	BaseSymbol,
	RuleID,
} from "./types.ts";

type RuleFunction<ProcessorReturnType = any> = (
	symbols: GrammarSymbol[],
	processor: Processor<ProcessorReturnType>
) => undefined;

type GrammarRuleType<Rules extends Record<any, any>, ProcessorReturnType> = {
	[key in keyof Rules]: RuleFunction<ProcessorReturnType>;
};

export class Grammar<ProcessorReturnType extends any> {
	private rules = new Map<string, Rule[]>();

	constructor() {}

	private startingRuleId: string | null = null;

	useRules<Rules extends Record<string, any>>(
		rulesMap: Rules
	): GrammarRuleType<Rules, ProcessorReturnType> {
		const ruleIds = Object.keys(rulesMap);

		const rules = this.rules;

		const proxys = {};

		for (const ruleId of ruleIds) {
			this.rules.set(ruleId, []);

			// @ts-ignore
			proxys[ruleId] = new Proxy(() => {}, {
				apply(target, thisArg, argArray) {
					const [symbols, processor] = argArray;

					rules.get(ruleId)?.push({
						symbols,
						processor,
					});
				},
				get(target, prop, receiver) {
					if (prop !== "symbol") {
						return null;
					}

					const rule: RuleID = {
						type: "rule",
						ruleId: ruleId,
					};

					return rule;
				},
			}) as any;
		}

		return proxys as any;
	}

	private transformProxyFunctionIntoValue(
		rule: RuleFunction<ProcessorReturnType>
	): RuleID {
		// @ts-ignore
		if (!rule?.symbol?.type === "rule") {
			throw new Error("Invalid function");
		}

		// @ts-ignore
		return rule?.symbol as RuleID;
	}

	setStartingRule(rule: RuleFunction<ProcessorReturnType>) {
		this.startingRuleId = this.transformProxyFunctionIntoValue(rule).ruleId;
	}

	buildGrammar(lexer: Lexer): NearleyGrammar {
		if (!this.startingRuleId) {
			// set the first rule as the starting rule if there is no defined starting rule
			this.startingRuleId = this.rules.keys().next().value;

			if (!this.startingRuleId) {
				throw new Error("No rules to build grammar from!");
			}
		}

		const ParserStart: string = this.startingRuleId as string;

		const ParserRules = this.buildRules();

		return {
			Lexer: lexer,
			ParserRules,
			ParserStart,
		};
	}

	buildRules() {
		const usedRules = new Set<string>();
		const definedRules = new Set<string>();

		const ParserRules: NearleyGrammar["ParserRules"] = [];

		const wrapPostprocess = (processor: (...args: any[]) => any) => {
			return (args: any[]) => {
				const result = processor(...args);

				args = args.filter((arg) => arg);

				if (result) {
					result.line = args[0]?.line;
					result.col = args[0]?.col;
				}

				return result;
			};
		};

		for (const [name, ruleList] of this.rules.entries()) {
			let addOnNumber = 1;

			definedRules.add(name);

			for (const { processor, symbols: rawSymbols } of ruleList) {
				const symbols: NearleySymbol[] = [];

				const postprocess = wrapPostprocess(processor);

				for (const rawSymbol of rawSymbols) {
					const transformBaseSymbol = (
						baseSymbol: BaseSymbol
					): NearleySymbol => {
						// @ts-ignore
						if (typeof baseSymbol === "function") {
							// @ts-ignore
							const ruleId: string =
								this.transformProxyFunctionIntoValue(baseSymbol).ruleId;

							usedRules.add(ruleId);

							return ruleId;
						}

						if (typeof baseSymbol === "number") {
							return {
								type: baseSymbol.toString(),
							};
						}

						throw new Error("invalid base symbol");
					};

					if (rawSymbol instanceof AddOnSymbol) {
						const { name: addOnName, rules: addOnRules } = rawSymbol.transform(
							name,
							transformBaseSymbol(rawSymbol.symbol),
							addOnNumber++
						);

						for (const addOnRule of addOnRules) {
							addOnRule.postprocess = wrapPostprocess(addOnRule.postprocess);
						}

						ParserRules.push(...addOnRules);

						symbols.push(addOnName);

						continue;
					}

					symbols.push(transformBaseSymbol(rawSymbol));
				}

				ParserRules.push({
					postprocess,
					name: name,
					symbols,
				});
			}
		}

		// check if grammar uses rule that hasn't been defined
		for (const usedRule of usedRules.values()) {
			if (!definedRules.has(usedRule)) {
				throw new Error("Grammar references undefined rule");
			}
		}

		return ParserRules;
	}
}

export type CFG = Record<string, string[]>;
