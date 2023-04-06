export enum BinaryOperators {
	Addition = "+",
	Substraction = "-",
	Multiplication = "*",
	Division = "/",
	Modulo = "%",
}

export enum ValueTypes {
	Number = "num",
	String = "str",
}

export abstract class Value {
	constructor(public type: ValueTypes) {}

	handleBinaryOperation(operator: BinaryOperators, value: Value): Value {
		throw new Error("unhandled binary operation");
	}

	abstract toString(): string;
}

export class NumberValue extends Value {
	private value: number;

	constructor(options: { value: number }) {
		super(ValueTypes.Number);

		if (isNaN(options.value)) {
			throw new Error("invalid number literal");
		}

		this.value = options.value;
	}

	handleBinaryOperation(
		operator: BinaryOperators,
		number: NumberValue
	): NumberValue {
		let value: number = 0;

		switch (operator) {
			case BinaryOperators.Addition:
				value = this.value + number.value;
				break;
			case BinaryOperators.Multiplication:
				value = this.value * number.value;
				break;
			case BinaryOperators.Substraction:
				value = this.value - number.value;
				break;
			case BinaryOperators.Division:
				value = this.value / number.value;
				break;

			default:
				throw new Error("unhandled operator");
		}

		return new NumberValue({ value });
	}

	toString(): string {
		return this.value.toString();
	}
}

export class StringValue extends Value {
	private value: string;

	constructor(options: { value: string }) {
		super(ValueTypes.String);

		this.value = options.value;
	}

	handleBinaryOperation(
		operator: BinaryOperators,
		string: StringValue
	): StringValue {
		switch (operator) {
			case BinaryOperators.Addition:
				return new StringValue({ value: this.value + string.value });

			default:
				throw new Error("String doesnt support this binary operationr");
		}
	}

	toString(): string {
		return this.value.toString();
	}
}
