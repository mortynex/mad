import { BinaryOperators, ValueTypes } from "../interpreter/values.ts";
import { Token } from "../lexer.ts";

export enum StatementTypes {
	Program,
	NumberLiteral,
	StringLiteral,
	BinaryOperation,
	Identifier,
	VariableAssignment,
	VariableDeclaration,
}

export interface StatementLocation {
	col: number;
	line: number;
}

export interface Statement {
	type: StatementTypes;
	end: StatementLocation;
	start: StatementLocation;
}

export interface Program {
	type: StatementTypes.Program;
	body: Statement[];
}

export interface Expression extends Statement {}

export interface Identifier extends Expression {
	type: StatementTypes.Identifier;
	name: string;
}

export interface VariableAssignment extends Expression {
	type: StatementTypes.VariableAssignment;
	id: Identifier;
	value: Expression;
}

export interface VariableDeclaration extends Omit<VariableAssignment, "type"> {
	type: StatementTypes.VariableDeclaration;
	variableType: ValueTypes;
}

export interface NumberLiteral extends Expression {
	type: StatementTypes.NumberLiteral;
	value: string;
}

export interface StringLiteral extends Expression {
	type: StatementTypes.NumberLiteral;
	value: string;
}

export interface BinaryOperation extends Expression {
	type: StatementTypes.BinaryOperation;
	left: Expression;
	right: Expression;
	operator: BinaryOperators;
}
