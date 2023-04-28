import { TokenTypes } from "../../lexer/tokens.ts";
import { ZERO_OR_MORE, ONE_OR_MORE } from "../cfg/AddOns.ts";
import { rules, none } from "./main.ts";

// optional whitespace
rules._([ZERO_OR_MORE(TokenTypes.WS)], none);

// mandatory whitespace
rules.__([ONE_OR_MORE(TokenTypes.WS)], none);
