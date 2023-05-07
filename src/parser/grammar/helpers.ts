import { TokenTypes } from "../../lexer/tokens.ts";
import { ZERO_OR_MORE, ONE_OR_MORE } from "../cfg/AddOns.ts";
import { rules, none } from "./main.ts";

// optional whitespace
rules._([ZERO_OR_MORE(TokenTypes.WS)], none);

// mandatory whitespace
rules.__([ONE_OR_MORE(TokenTypes.WS)], none);

rules.$WS_or_NL([TokenTypes.WS], none);
rules.$WS_or_NL([TokenTypes.NL], none);

rules.$WS_then_NL([rules._, TokenTypes.NL], none);

// optional multiline whitespace
rules._ml([ZERO_OR_MORE(rules.$WS_or_NL)], none);

// mandatory multiline whitespace
rules.__ml([ONE_OR_MORE(rules.$WS_or_NL)], none);

// mandatory linebreak
rules.__lb([ONE_OR_MORE(rules.$WS_then_NL), rules._], none);
