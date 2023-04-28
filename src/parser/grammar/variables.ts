import { TokenTypes } from "../../lexer/tokens.ts";
import {
	Expression,
	Identifier,
	StatementTypes,
	VariableAssignment,
	VariableDeclaration,
} from "../ast.ts";
import { rules } from "./main.ts";

rules.VariableDeclaration(
	[
		TokenTypes.VariableDeclarationKeyword,
		rules.__,
		rules.Identifier,
		rules._,
		TokenTypes.AssignmentOperator,
		rules._,
		rules.Expression,
	],
	(...args: any[]): VariableDeclaration => {
		const id: Identifier = args[2];
		const value: Expression = args[6];

		return {
			type: StatementTypes.VariableDeclaration,
			id,
			value,
		};
	}
);

rules.VariableAssignment(
	[
		rules.Identifier,
		rules._,
		TokenTypes.AssignmentOperator,
		rules._,
		rules.Expression,
	],
	(...args: any[]): VariableAssignment => {
		const id: Identifier = args[0];
		const value: Expression = args[4];

		return {
			type: StatementTypes.VariableAssignment,
			id,
			value,
		};
	}
);
