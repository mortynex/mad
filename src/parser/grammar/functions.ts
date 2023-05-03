import { TokenTypes } from "../../lexer/tokens.ts";
import { FunctionCall, FunctionDeclaration, StatementTypes } from "../ast.ts";
import { OPTIONAL } from "../cfg/AddOns.ts";
import { rules, id, at } from "./main.ts";

// function call

rules.FunctionCall(
	[
		rules.Identifier,
		rules._,
		TokenTypes.LParen,
		rules._,
		OPTIONAL(rules.$FunctionCallArgs),
		rules._,
		TokenTypes.RParen,
	],
	(id, __, ___, ____, args): FunctionCall => ({
		type: StatementTypes.FunctionCall,
		id,
		args: args ?? [],
	})
);

rules.$FunctionCallArgs(
	[
		rules.Expression,
		rules._,
		TokenTypes.Comma,
		rules._,
		rules.$FunctionCallArgs,
	],
	(expr, __, _, ___, args) => [expr, ...args] as any
);

rules.$FunctionCallArgs([rules.Expression], (expr) => [expr] as any);

// function declaration

rules.FunctionDeclaration(
	[
		TokenTypes.FunctionKeyword,
		rules._,
		rules.Identifier,
		rules._,
		TokenTypes.LParen,
		rules._,
		OPTIONAL(rules.$FunctionDeclarationParams),
		rules._,
		TokenTypes.RParen,
		rules._,
		rules.Codeblock,
	],
	(...args: any[]): FunctionDeclaration => {
		return {
			type: StatementTypes.FunctionDeclaration,
			id: args[2],
			params: args[6] ?? [],
			program: args[10],
		};
	}
);

rules.$FunctionDeclarationParams(
	[
		rules.Identifier,
		rules._,
		TokenTypes.Comma,
		rules._,
		rules.$FunctionDeclarationParams,
	],
	(id, __, ___, ____, params) => [id, ...params] as any
);

rules.$FunctionDeclarationParams([rules.Identifier], (id) => [id] as any);
