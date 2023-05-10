export enum TokenTypes {
	LParen,
	RParen,

	LArgParen,
	RArgParen,

	LCodeBlockParen,
	RCodeBlockParen,

	Comma,

	Number,
	String,

	BinaryAdditionOperator,
	BinaryMultiplicationOperator,
	AssignmentOperator,
	Identifier,

	VariableDeclarationKeyword,
	FunctionKeyword,
	ReturnKeyword,

	// whitespaces
	WS,
	NL,
	// special tokens
	EOF,
	NoMatch,
}

export interface Token {
	value: string;
	text: string;
	type: TokenTypes;
	line: number;
	col: number;
}

export enum BinaryOperator {
	Addition = "+",
	Substraction = "-",
	Multiplication = "*",
	Division = "/",
	Modulo = "%",
}