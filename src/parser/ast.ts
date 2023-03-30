import { BinaryOperator } from "../lexer.ts";

export enum StatementTypes {
	Program,
	NumberLiteral,
	BinaryOperation,
}

export interface Statement {
	type: StatementTypes;
}

export interface Program {
	type: StatementTypes.Program;
	body: Statement[];
}

export interface Expression extends Statement {}

export interface NumberLiteral extends Expression {
	type: StatementTypes.NumberLiteral;
	value: string;
}

export interface BinaryOperation extends Expression {
	type: StatementTypes.BinaryOperation;
	left: Expression;
	right: Expression;
	operator: BinaryOperator;
}
