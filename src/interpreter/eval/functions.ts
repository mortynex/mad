import { InterpreterError } from "../../errors.ts";
import { FunctionCall } from "../../parser/ast.ts";
import { Scope } from "../scope/scope.ts";
import {
	FunctionValue,
	NativeFunctionValue,
	Value,
	ValueType,
} from "../values/values.ts";
import { evaluate, EvaluateFunction } from "./main.ts";

const isNativeFunction = (val: Value): val is NativeFunctionValue => {
	return val.type === ValueType.NativeFunction;
};

const isFunction = (val: Value): val is FunctionValue => {
	return val.type === ValueType.Function;
};

export const evalFunctionCall: EvaluateFunction<FunctionCall> = (
	scope: Scope,
	stmt: FunctionCall
) => {
	const record = scope.resolve(stmt.id);

	if (!record) {
		throw new InterpreterError(stmt, `Function "${stmt.id}" is not defined`);
	}

	const func = record.value;

	const args = stmt.args.map((arg) => evaluate(scope, arg));

	if (isNativeFunction(func)) {
		return func.run(args);
	}

	if (!isFunction(func)) {
		throw new InterpreterError(stmt, `"${stmt.id}" is not a function`);
	}

	throw new InterpreterError(stmt, "Not implemented");

	/* const funcScope = new Scope(scope);
    
    for(const param of func.params) {} */
};
