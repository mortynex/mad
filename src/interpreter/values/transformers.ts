import {
	Booleans,
	BooleanValue,
	NumberValue,
	StringValue,
	Value,
	ValueType,
} from "./values.ts";

export const transformValue = (input: Value): string => {
	switch (input.type) {
		case ValueType.Number:
			return (input as NumberValue).value.toString();

		case ValueType.String:
			return (input as StringValue).value;

		case ValueType.Boolean:
			return (input as BooleanValue).value ? Booleans.True : Booleans.False;

		default:
			return input.type;
	}
};
