import { BinaryOperator } from "../lexer/tokens.ts";

export enum StatementTypes {
	Program,
	NumberLiteral,
	BinaryOperation,
	Identifier,
	VariableAssignment,
	VariableDeclaration,
	StringLiteral,
	FunctionCall,
	FunctionDeclaration,
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

export interface VariableDeclaration extends Statement {
	type: StatementTypes.VariableDeclaration;
	id: Identifier;
	value: Expression;
}

export interface NumberLiteral extends Expression {
	type: StatementTypes.NumberLiteral;
	value: string;
}

export interface StringLiteral extends Expression {
	type: StatementTypes.StringLiteral;
	value: string;
}

export interface BinaryOperation extends Expression {
	type: StatementTypes.BinaryOperation;
	left: Expression;
	right: Expression;
	operator: BinaryOperator;
}

export interface FunctionCall extends Expression {
	type: StatementTypes.FunctionCall;
	id: Identifier;
	args: Expression[];
}

export interface FunctionDeclaration extends Statement {
	type: StatementTypes.FunctionDeclaration;
	id: Identifier;
	args: Identifier[];
	body: Statement[];
}
