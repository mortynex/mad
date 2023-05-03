import { InterpreterError } from "../../errors.ts";
import { FunctionCall, FunctionDeclaration } from "../../parser/ast.ts";
import { ScopeRecord } from "../scope/record.ts";
import { Scope } from "../scope/scope.ts";
import { ScopeType } from "../scope/types.ts";
import { mkNull } from "../values/factories.ts";
import {
	FunctionValue,
	NativeFunctionValue,
	Value,
	ValueType,
} from "../values/values.ts";
import { evaluate, EvaluateFunction } from "./main.ts";
import { evalProgram } from "./program.ts";

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

	const funcScope = new Scope(ScopeType.Function, scope);

	if (args.length !== func.params.length) {
		throw new InterpreterError(
			stmt,
			`Function "${stmt.id}" expects ${func.params.length} arguments, but ${args.length} were provided`
		);
	}

	for (const param of func.params) {
		funcScope.assign(
			param.id,
			new ScopeRecord(args.shift()!, { mutable: true })
		);
	}

	return evalProgram(funcScope, func.body);
};

export const evalFunctionDeclaration: EvaluateFunction<FunctionDeclaration> = (
	scope: Scope,
	stmt: FunctionDeclaration
) => {
	const fun: FunctionValue = {
		type: ValueType.Function,
		params: stmt.params.map((id) => ({ id })),
		body: stmt.program,
	};

	if (scope.has(stmt.id)) {
		throw new InterpreterError(stmt, `Cannot redeclare name "${stmt.id.name}"`);
	}

	scope.assign(stmt.id, new ScopeRecord(fun, { mutable: false }));

	return mkNull();
};
