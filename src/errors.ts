import { Statement } from "./parser/ast.ts";

import { sample } from "https://deno.land/std@0.182.0/collections/sample.ts";

export enum ErrorType {
	Internal = "<Iternal Error>",
}

export class InterpreterError {
	constructor(private statement: Statement, public message: string) {}

	get node(): {
		line: number;
		col: number;
	} {
		return this.statement as any;
	}
}

const FACES = [
	"ఠ_ఠ",
	"ಠ_ಠ",
	"ಠ¿ಠ",
	"༼ಠ益ಠ༽",
	"•`_´•",
	"ಠ╭╮ಠ",
	"ಠ益ಠ",
	">o<",
	"눈_눈",
	"´･_･`",
	"<_<",
];

const getRandomASCIIFace = () => {
	return `(${sample(FACES)})`;
};

export const throwFormatedError = (
	message: string,
	code: string,
	line: number,
	col: number
) => {
	const lines = code.split("\n");

	const lineText = code.split("\n").at(line - 1);

	if (line === 0) {
		line = lines.length;
	}

	if (!lineText) {
		throw new Error("INTERNAL ERROR: invalid line number in error message");
	}

	if (col === -1) col = lineText.length + 1;

	const headline = `\n${line} | `;

	console.error(headline + lineText);
	console.error(" ".repeat(headline.length - 1 + col - 1) + "˄");
	console.error(
		" ".repeat(headline.length - 1 + col - 1) +
			`乁${getRandomASCIIFace()}ノ ?!\n`
	);

	console.error("🤬 " + message + "❗\n");
};
