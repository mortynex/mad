import { TokenTypes, Token } from "../../lexer/tokens.ts";
import {
	NumberLiteral,
	StatementTypes,
	Identifier,
	StringLiteral,
} from "../ast.ts";
import { rules, id, at } from "./main.ts";

rules.Expression([rules.Addition], id);

// goes through addition to correctly parse binary operations

rules.Basic([rules.NumberLiteral], id);
rules.Basic([rules.StringLiteral], id);
rules.Basic([rules.Identifier], id);
rules.Basic([rules.VariableAssignment], id);
rules.Basic([rules.Parens], id);

rules.Parens(
	[TokenTypes.LParen, rules._, rules.Expression, rules._, TokenTypes.RParen],
	at(2)
);

rules.NumberLiteral(
	[TokenTypes.Number],
	(number: Token): NumberLiteral => ({
		type: StatementTypes.NumberLiteral,
		value: number.value,
	})
);

rules.StringLiteral(
	[TokenTypes.String],
	({ value }: Token): StringLiteral => ({
		type: StatementTypes.StringLiteral,
		value,
	})
);

rules.Identifier(
	[TokenTypes.Identifier],
	(token: Token): Identifier => ({
		type: StatementTypes.Identifier,
		name: token.value,
	})
);
