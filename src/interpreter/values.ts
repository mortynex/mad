import { BinaryOperator } from "../lexer.ts";

export enum ValueTypes {
	Number = "num",
}

export abstract class Value {
	constructor(public type: ValueTypes) {}

	handleBinaryOperation(operator: BinaryOperator, value: Value): Value {
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
		operator: BinaryOperator,
		number: NumberValue
	): NumberValue {
		let value: number = 0;

		switch (operator) {
			case BinaryOperator.Addition:
				value = this.value + number.value;
				break;
			case BinaryOperator.Multiplication:
				value = this.value * number.value;
				break;
			case BinaryOperator.Substraction:
				value = this.value - number.value;
				break;
			case BinaryOperator.Division:
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
