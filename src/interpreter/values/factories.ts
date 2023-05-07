import {
	Booleans,
	BooleanValue,
	NullValue,
	NumberValue,
	StringValue,
	Value,
	ValueType,
} from "./values.ts";

export const mkNumber = (value: number): NumberValue => {
	return {
		type: ValueType.Number,
		value,
	};
};

export const mkString = (value: string): StringValue => {
	return {
		type: ValueType.String,
		value,
	};
};

export const mkBoolean = (bool: boolean): BooleanValue => {
	return {
		type: ValueType.Boolean,
		value: bool,
	};
};

export const mkFalse = () => mkBoolean(false);
export const mkTrue = () => mkBoolean(true);

export const mkNull = (): NullValue => ({ type: ValueType.Null });

export const mkNativeFunction = (runFunction: (args: Value[]) => any) => {
	return {
		type: ValueType.NativeFunction,
		run: runFunction,
	};
};
