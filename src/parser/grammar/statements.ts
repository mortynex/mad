import { rules, id } from "./main.ts";

rules.Statement([rules.Expression], id);
rules.Statement([rules.VariableDeclaration], id);
