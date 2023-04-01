import { ValueTypes } from "../interpreter/values.ts";
import { BinaryOperator, Token } from "../lexer.ts";

export enum StatementTypes {
	Program,
	NumberLiteral,
	BinaryOperation,
	Identifier,
	VariableAssignment,
	VariableDeclaration,
}

export interface Statement {
	type: StatementTypes;
	//tokenEnd: Token; TODO: statement error handleing
	//tokenStart: Token;
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

export interface BinaryOperation extends Expression {
	type: StatementTypes.BinaryOperation;
	left: Expression;
	right: Expression;
	operator: BinaryOperator;
}
