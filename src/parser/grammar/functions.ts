import { TokenTypes } from "../../lexer/tokens.ts";
import { StatementTypes } from "../ast.ts";
import { OPTIONAL } from "../cfg/AddOns.ts";
import { rules, id, at } from "./main.ts";

rules.FunctionCall(
	[
		rules.Identifier,
		rules._,
		TokenTypes.LParen,
		rules._,
		OPTIONAL(rules.FunctionCallArgs),
		OPTIONAL(rules._),
		TokenTypes.RParen,
	],
	(id, __, ___, ____, args) => ({
		type: StatementTypes.FunctionCall,
		name: id.name,
		args,
	})
);

rules.FunctionCallArgs(
	[rules.Expression, rules.__, rules.FunctionCallArgs],
	(expr, __, args) => [expr, ...args] as any
);

rules.FunctionCallArgs([rules.Expression], (expr) => [expr] as any);
