import { rules, id } from "./main.ts";

rules.Statement([rules.Expression], id);
rules.Statement([rules.VariableDeclaration], id);
rules.Statement([rules.FunctionCall], id);
rules.Statement([rules.FunctionDeclaration], id);
