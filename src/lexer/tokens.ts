export enum TokenTypes {
	LParen,
	RParen,

	CBraceL,
	CBraceR,

	ListSeperator,

	Number,
	String,

	BinaryAdditionOperator,
	BinaryMultiplicationOperator,
	AssignmentOperator,
	Identifier,
	ValueType,

	FunctionKeyword,
	MutableKeyword,
	ReturnKeyword,

	// whitespaces\
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
