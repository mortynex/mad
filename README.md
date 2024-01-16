# programovaci jazyk mad

Programovací jazyk, který jsem vytvořil jako pololetní projekt do školy. 

Projekt je rozdělen na **lexer**, **parser** a **interpreter**

**Lexer** má za úkol rozdělit kód od uživatele na tokeny např. `whitespace`, `left_bracket`, `function_keyword` a podobně.

**Parser** následně vezme tokeny a rozdělí je na AST strom, kdě už jsou popsány různe statementy a operace jako zavoláni funkce, sčítaní dvou hodnot a podobně.

**Interpreter** pak AST strom vezme a seshora (jakoby řádek po řádku) vykonaváná příkazy, sčíta hodnoty, ukládá neznámé do paměti a podobně. 

## Co to umí?
- číselné operace
- dynamické proměnné
- funkce s argumentama
- hodnotové typy jako řetězce, čísla, boolean a null
- REPL či čtení souborů

## [Odkaz na dokumentaci](documentation.md)
