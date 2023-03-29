export enum ASTTypes {
	Program,
	NumberLiteral,
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
