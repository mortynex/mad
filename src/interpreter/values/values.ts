import { Identifier, Program, Statement } from "../../parser/ast.ts";

export enum ValueType {
	Number = "num",
	Function = "[function]",
	NativeFunction = "[native function]",
	String = "str",
	Boolean = "bool",
	Null = "null",
}

export enum Booleans {
	True = "true",
	False = "false",
}

export interface Value {
	type: ValueType;
}

export interface NumberValue extends Value {
	type: ValueType.Number;
	value: number;
}

export interface StringValue extends Value {
	type: ValueType.String;
	value: string;
}

export interface BooleanValue extends Value {
	type: ValueType.Boolean;
	value: boolean;
}

export interface NullValue extends Value {
	type: ValueType.Null;
}

export interface FunctionValue extends Value {
	type: ValueType.Function;
	params: FunctionParam[];
	body: Program;
}

export interface FunctionParam {
	id: Identifier;
}

export interface NativeFunctionValue extends Value {
	type: ValueType.NativeFunction;
	run: (args: Value[]) => Value;
}
