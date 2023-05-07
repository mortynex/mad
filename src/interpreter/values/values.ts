import { Statement } from "../../parser/ast.ts";

export enum ValueType {
	Number = "num",
	Function = "[function]",
	NativeFunction = "[native function]",
	String = "str",
	Boolean = "bool",
	Null = "null",
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
	params: string[];
	body: Statement[];
}

export interface NativeFunctionValue extends Value {
	type: ValueType.NativeFunction;
	run: (args: Value[]) => Value;
}
