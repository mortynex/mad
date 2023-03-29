import { BinaryOperator } from "../lexer.ts";

export enum ASTTypes {
	Program,
	NumberLiteral,
	BinaryOperation,
}

export interface ASTNode {
	type: ASTTypes;
}

export interface Program {
	type: ASTTypes.Program;
	body: ASTNode[];
}

export interface Expression extends ASTNode {}

export interface NumberLiteral extends Expression {
	type: ASTTypes.NumberLiteral;
	value: string;
}

export interface BinaryOperation extends Expression {
	type: ASTTypes.BinaryOperation;
	left: Expression;
	right: Expression;
	operator: BinaryOperator;
}
