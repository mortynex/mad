# Projekt mad 💢

## co aplikace dělá

Projekt je parser a interpreter meho programovaci jazyku **mad** (protoze už mě to štve 😡). Programovaci jazyk dokáže vytvářet a měnit proměnné a definovat a volat funkce. Mužete pracovat s 5 datovými typy: čísla, řetězce, pravdu/nepravdu, null a funkce. Mad je dynamicky (alespon prozatím), funkcni a hodně high level jazyk (ono to moc nejde udelat low level kdyz interpreter je postaven na high level jazyku).

## popis použitých technologií

Projekt je postaven na jazyku typescript a runtime Deno, vybral jsem si typescript jelikož s ním mám nejvíc zkušeností co se týče programovacích jazyků a protože oproti javascriptu je staticky psany takže stravim min casu debuggovanim hloupych chyb. Deno jsem si vybral protozeprotože má "out of the box" typescript podporu a byl jsem líny setupovat typescript s nodejs. Mimo to jsem ho chtel uz nejakou dobu vyzkouset. V projektu jsem taky pouzil npm knihovy "nearley.js" pro context-free parsovani a "moo" pro lexovani. Mimo to jsem v pozdejší fazi začal používat github copilota a občas i chatGPT, ale ten né zas tak moc.

## stručný popis jak to funguje uvnitř

Aplikace má 3 části: lexer, parser a interpreter. Lexer používá knihovnu moo a pomoci regexu rozděluje text na tokenu jako napřiklad "whitespace", "function_keyword", "left_brace" etc. Tyto tokenu jsou pak poslany do parseru ktery použiva nearley.js aby tyto tokenu pomoci předem definovane gramatiku udělat takzvany AST strom. Nearley.js nabizi vlastni zpusob vytvaření bezkontextni gramatiky ale já jsem se rozhodl kvůli nepodpoře typescriptu vytvořit vlastní způsob, který umožnuje vytvářet gramatiku v typescriptu relativne bezpečne s ohledem na statické psani. AST strom obsahuje instrukce ktere jsou poslany interpreteru. Interpreter následně řádek po řádku instrukce projde a udělá změny podle instrukci. Interpreter vytváří scopy kde uklada promene a funkce. Interpreter ma take call stack pro volani funkci a dalsi interni funkce.

## návod na použití projektu

K použití je potřeba mít nainstalované Deno (https://deno.com/manual/getting_started/installation),
pak stačí zklonovat repořitař, spusti komandovy řádek a napsat _deno task run \<cesta k souboru>_. Cesta k souboru neni nutna, pokud je vynechana skript se spusti v modu REPL a vy mužete kod psan po řádek po řádku a on bude průběžně interpretován. Po káždém řádku bude do konzole vypsán hodnotu každé instrukce nebo popřípadná error. V případě že zadáte cestu k souboru (buď relativni "tests/variables.mad" nebo absolutni "C:\\Users\\...\mujkod.mad") tak skript váš kód přečte a interpretuje ho najednou. V konzoli se něco objeví jen v případě že váš kod použil nativní funkci "print" pro vypsani textu do konzole. V budoucnu bych měl v plánu komplivat skript do executable a pak mit nejaky instalater, který ho nainstaluje do PATH aby mohl byt použit z komandove lajny.

## možný rozvoj v budoucnu/popis reálného využití projektu

Projekt je funknčí a dokáže interpretovat základní instrukce (což byl cil projektu takže to mam jakoby hotovo), ale nestihl jsem implementovat všechny funkce které jsem chtěl. Mezi ně patří listy, objekty, nativni funkce, nativni knihovna, while loop, for loop, nejakej vlastni vymyslenej loop, if statementy, if else statementy, else statementy, porovnavani, efekty, matche, strukty, throwovani erroru, try catch statement, pipe operator, switch statement nebo neco podobneho, **aby jazyk byl staticky psan**, mutabilita, komenty, lambda/anonymni funkce a další.

Realné využití projekt zatím moc nemá, jelikož jakýkoliv rozsáhlejší programovací jazyk dokáže cokoliv i vic než tento a to ještě rychleji a praktičtěji. Dokázal bych si představit realné využití pokud bych jazyk specializoval a odlišil od ostatních. Předtím bych ale musel zapracovat i na optimalizaci, jelikož jak si dokážete představit, interpreter postavený na high level jazyku nebude mit nejlepsi memory managment a celkove vykon jelikož všechny datatypy musí jít přes dalši interpreter a další abstrakci. Vykon bych určitě zvýšil kdybych interpeter přepsal v nějakém low level jazyku jako C++ nebo Rust, ale furt to nebude tak super jak u kompilovanych jazyku.
