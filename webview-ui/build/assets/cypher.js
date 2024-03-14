/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "`", close: "`" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "`", close: "`" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: `.cypher`,
  ignoreCase: true,
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.bracket" },
    { open: "(", close: ")", token: "delimiter.parenthesis" }
  ],
  keywords: [
    "ALL",
    "AND",
    "AS",
    "ASC",
    "ASCENDING",
    "BY",
    "CALL",
    "CASE",
    "CONTAINS",
    "CREATE",
    "DELETE",
    "DESC",
    "DESCENDING",
    "DETACH",
    "DISTINCT",
    "ELSE",
    "END",
    "ENDS",
    "EXISTS",
    "IN",
    "IS",
    "LIMIT",
    "MANDATORY",
    "MATCH",
    "MERGE",
    "NOT",
    "ON",
    "ON",
    "OPTIONAL",
    "OR",
    "ORDER",
    "REMOVE",
    "RETURN",
    "SET",
    "SKIP",
    "STARTS",
    "THEN",
    "UNION",
    "UNWIND",
    "WHEN",
    "WHERE",
    "WITH",
    "XOR",
    "YIELD"
  ],
  builtinLiterals: ["true", "TRUE", "false", "FALSE", "null", "NULL"],
  builtinFunctions: [
    "abs",
    "acos",
    "asin",
    "atan",
    "atan2",
    "avg",
    "ceil",
    "coalesce",
    "collect",
    "cos",
    "cot",
    "count",
    "degrees",
    "e",
    "endNode",
    "exists",
    "exp",
    "floor",
    "head",
    "id",
    "keys",
    "labels",
    "last",
    "left",
    "length",
    "log",
    "log10",
    "lTrim",
    "max",
    "min",
    "nodes",
    "percentileCont",
    "percentileDisc",
    "pi",
    "properties",
    "radians",
    "rand",
    "range",
    "relationships",
    "replace",
    "reverse",
    "right",
    "round",
    "rTrim",
    "sign",
    "sin",
    "size",
    "split",
    "sqrt",
    "startNode",
    "stDev",
    "stDevP",
    "substring",
    "sum",
    "tail",
    "tan",
    "timestamp",
    "toBoolean",
    "toFloat",
    "toInteger",
    "toLower",
    "toString",
    "toUpper",
    "trim",
    "type"
  ],
  operators: [
    "+",
    "-",
    "*",
    "/",
    "%",
    "^",
    "=",
    "<>",
    "<",
    ">",
    "<=",
    ">=",
    "->",
    "<-",
    "-->",
    "<--"
  ],
  escapes: /\\(?:[tbnrf\\"'`]|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+/,
  octaldigits: /[0-7]+/,
  hexdigits: /[0-9a-fA-F]+/,
  tokenizer: {
    root: [[/[{}[\]()]/, "@brackets"], { include: "common" }],
    common: [
      { include: "@whitespace" },
      { include: "@numbers" },
      { include: "@strings" },
      [/:[a-zA-Z_][\w]*/, "type.identifier"],
      [
        /[a-zA-Z_][\w]*(?=\()/,
        {
          cases: {
            "@builtinFunctions": "predefined.function"
          }
        }
      ],
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@builtinLiterals": "predefined.literal",
            "@default": "identifier"
          }
        }
      ],
      [/`/, "identifier.escape", "@identifierBacktick"],
      [/[;,.:|]/, "delimiter"],
      [
        /[<>=%+\-*/^]+/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ]
    ],
    numbers: [
      [/-?(@digits)[eE](-?(@digits))?/, "number.float"],
      [/-?(@digits)?\.(@digits)([eE]-?(@digits))?/, "number.float"],
      [/-?0x(@hexdigits)/, "number.hex"],
      [/-?0(@octaldigits)/, "number.octal"],
      [/-?(@digits)/, "number"]
    ],
    strings: [
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@stringDouble"],
      [/'/, "string", "@stringSingle"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/\/\/.*/, "comment"],
      [/[^/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[/*]/, "comment"]
    ],
    stringDouble: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string"],
      [/\\./, "string.invalid"],
      [/"/, "string", "@pop"]
    ],
    stringSingle: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string"],
      [/\\./, "string.invalid"],
      [/'/, "string", "@pop"]
    ],
    identifierBacktick: [
      [/[^\\`]+/, "identifier.escape"],
      [/@escapes/, "identifier.escape"],
      [/\\./, "identifier.escape.invalid"],
      [/`/, "identifier.escape", "@pop"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lwaGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2N5cGhlci9jeXBoZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2N5cGhlci9jeXBoZXIudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46IFwiYFwiLCBjbG9zZTogXCJgXCIgfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9LFxuICAgIHsgb3BlbjogXCJgXCIsIGNsb3NlOiBcImBcIiB9XG4gIF1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBgLmN5cGhlcmAsXG4gIGlnbm9yZUNhc2U6IHRydWUsXG4gIGJyYWNrZXRzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuY3VybHlcIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfVxuICBdLFxuICBrZXl3b3JkczogW1xuICAgIFwiQUxMXCIsXG4gICAgXCJBTkRcIixcbiAgICBcIkFTXCIsXG4gICAgXCJBU0NcIixcbiAgICBcIkFTQ0VORElOR1wiLFxuICAgIFwiQllcIixcbiAgICBcIkNBTExcIixcbiAgICBcIkNBU0VcIixcbiAgICBcIkNPTlRBSU5TXCIsXG4gICAgXCJDUkVBVEVcIixcbiAgICBcIkRFTEVURVwiLFxuICAgIFwiREVTQ1wiLFxuICAgIFwiREVTQ0VORElOR1wiLFxuICAgIFwiREVUQUNIXCIsXG4gICAgXCJESVNUSU5DVFwiLFxuICAgIFwiRUxTRVwiLFxuICAgIFwiRU5EXCIsXG4gICAgXCJFTkRTXCIsXG4gICAgXCJFWElTVFNcIixcbiAgICBcIklOXCIsXG4gICAgXCJJU1wiLFxuICAgIFwiTElNSVRcIixcbiAgICBcIk1BTkRBVE9SWVwiLFxuICAgIFwiTUFUQ0hcIixcbiAgICBcIk1FUkdFXCIsXG4gICAgXCJOT1RcIixcbiAgICBcIk9OXCIsXG4gICAgXCJPTlwiLFxuICAgIFwiT1BUSU9OQUxcIixcbiAgICBcIk9SXCIsXG4gICAgXCJPUkRFUlwiLFxuICAgIFwiUkVNT1ZFXCIsXG4gICAgXCJSRVRVUk5cIixcbiAgICBcIlNFVFwiLFxuICAgIFwiU0tJUFwiLFxuICAgIFwiU1RBUlRTXCIsXG4gICAgXCJUSEVOXCIsXG4gICAgXCJVTklPTlwiLFxuICAgIFwiVU5XSU5EXCIsXG4gICAgXCJXSEVOXCIsXG4gICAgXCJXSEVSRVwiLFxuICAgIFwiV0lUSFwiLFxuICAgIFwiWE9SXCIsXG4gICAgXCJZSUVMRFwiXG4gIF0sXG4gIGJ1aWx0aW5MaXRlcmFsczogW1widHJ1ZVwiLCBcIlRSVUVcIiwgXCJmYWxzZVwiLCBcIkZBTFNFXCIsIFwibnVsbFwiLCBcIk5VTExcIl0sXG4gIGJ1aWx0aW5GdW5jdGlvbnM6IFtcbiAgICBcImFic1wiLFxuICAgIFwiYWNvc1wiLFxuICAgIFwiYXNpblwiLFxuICAgIFwiYXRhblwiLFxuICAgIFwiYXRhbjJcIixcbiAgICBcImF2Z1wiLFxuICAgIFwiY2VpbFwiLFxuICAgIFwiY29hbGVzY2VcIixcbiAgICBcImNvbGxlY3RcIixcbiAgICBcImNvc1wiLFxuICAgIFwiY290XCIsXG4gICAgXCJjb3VudFwiLFxuICAgIFwiZGVncmVlc1wiLFxuICAgIFwiZVwiLFxuICAgIFwiZW5kTm9kZVwiLFxuICAgIFwiZXhpc3RzXCIsXG4gICAgXCJleHBcIixcbiAgICBcImZsb29yXCIsXG4gICAgXCJoZWFkXCIsXG4gICAgXCJpZFwiLFxuICAgIFwia2V5c1wiLFxuICAgIFwibGFiZWxzXCIsXG4gICAgXCJsYXN0XCIsXG4gICAgXCJsZWZ0XCIsXG4gICAgXCJsZW5ndGhcIixcbiAgICBcImxvZ1wiLFxuICAgIFwibG9nMTBcIixcbiAgICBcImxUcmltXCIsXG4gICAgXCJtYXhcIixcbiAgICBcIm1pblwiLFxuICAgIFwibm9kZXNcIixcbiAgICBcInBlcmNlbnRpbGVDb250XCIsXG4gICAgXCJwZXJjZW50aWxlRGlzY1wiLFxuICAgIFwicGlcIixcbiAgICBcInByb3BlcnRpZXNcIixcbiAgICBcInJhZGlhbnNcIixcbiAgICBcInJhbmRcIixcbiAgICBcInJhbmdlXCIsXG4gICAgXCJyZWxhdGlvbnNoaXBzXCIsXG4gICAgXCJyZXBsYWNlXCIsXG4gICAgXCJyZXZlcnNlXCIsXG4gICAgXCJyaWdodFwiLFxuICAgIFwicm91bmRcIixcbiAgICBcInJUcmltXCIsXG4gICAgXCJzaWduXCIsXG4gICAgXCJzaW5cIixcbiAgICBcInNpemVcIixcbiAgICBcInNwbGl0XCIsXG4gICAgXCJzcXJ0XCIsXG4gICAgXCJzdGFydE5vZGVcIixcbiAgICBcInN0RGV2XCIsXG4gICAgXCJzdERldlBcIixcbiAgICBcInN1YnN0cmluZ1wiLFxuICAgIFwic3VtXCIsXG4gICAgXCJ0YWlsXCIsXG4gICAgXCJ0YW5cIixcbiAgICBcInRpbWVzdGFtcFwiLFxuICAgIFwidG9Cb29sZWFuXCIsXG4gICAgXCJ0b0Zsb2F0XCIsXG4gICAgXCJ0b0ludGVnZXJcIixcbiAgICBcInRvTG93ZXJcIixcbiAgICBcInRvU3RyaW5nXCIsXG4gICAgXCJ0b1VwcGVyXCIsXG4gICAgXCJ0cmltXCIsXG4gICAgXCJ0eXBlXCJcbiAgXSxcbiAgb3BlcmF0b3JzOiBbXG4gICAgXCIrXCIsXG4gICAgXCItXCIsXG4gICAgXCIqXCIsXG4gICAgXCIvXCIsXG4gICAgXCIlXCIsXG4gICAgXCJeXCIsXG4gICAgXCI9XCIsXG4gICAgXCI8PlwiLFxuICAgIFwiPFwiLFxuICAgIFwiPlwiLFxuICAgIFwiPD1cIixcbiAgICBcIj49XCIsXG4gICAgXCItPlwiLFxuICAgIFwiPC1cIixcbiAgICBcIi0tPlwiLFxuICAgIFwiPC0tXCJcbiAgXSxcbiAgZXNjYXBlczogL1xcXFwoPzpbdGJucmZcXFxcXCInYF18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvLFxuICBkaWdpdHM6IC9cXGQrLyxcbiAgb2N0YWxkaWdpdHM6IC9bMC03XSsvLFxuICBoZXhkaWdpdHM6IC9bMC05YS1mQS1GXSsvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbWy9be31bXFxdKCldLywgXCJAYnJhY2tldHNcIl0sIHsgaW5jbHVkZTogXCJjb21tb25cIiB9XSxcbiAgICBjb21tb246IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQG51bWJlcnNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdzXCIgfSxcbiAgICAgIFsvOlthLXpBLVpfXVtcXHddKi8sIFwidHlwZS5pZGVudGlmaWVyXCJdLFxuICAgICAgW1xuICAgICAgICAvW2EtekEtWl9dW1xcd10qKD89XFwoKS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAYnVpbHRpbkZ1bmN0aW9uc1wiOiBcInByZWRlZmluZWQuZnVuY3Rpb25cIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1thLXpBLVpfJF1bXFx3JF0qLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgIFwiQGJ1aWx0aW5MaXRlcmFsc1wiOiBcInByZWRlZmluZWQubGl0ZXJhbFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvYC8sIFwiaWRlbnRpZmllci5lc2NhcGVcIiwgXCJAaWRlbnRpZmllckJhY2t0aWNrXCJdLFxuICAgICAgWy9bOywuOnxdLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbXG4gICAgICAgIC9bPD49JStcXC0qL15dKy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIG51bWJlcnM6IFtcbiAgICAgIFsvLT8oQGRpZ2l0cylbZUVdKC0/KEBkaWdpdHMpKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvLT8oQGRpZ2l0cyk/XFwuKEBkaWdpdHMpKFtlRV0tPyhAZGlnaXRzKSk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbLy0/MHgoQGhleGRpZ2l0cykvLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbLy0/MChAb2N0YWxkaWdpdHMpLywgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbLy0/KEBkaWdpdHMpLywgXCJudW1iZXJcIl1cbiAgICBdLFxuICAgIHN0cmluZ3M6IFtcbiAgICAgIFsvXCIoW15cIlxcXFxdfFxcXFwuKSokLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvJyhbXidcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nRG91YmxlXCJdLFxuICAgICAgWy8nLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nU2luZ2xlXCJdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIndoaXRlXCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1xcL1xcLy4qLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9bXi8qXSsvLCBcImNvbW1lbnRcIl0sXG4gICAgICBbL1xcKlxcLy8sIFwiY29tbWVudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1svKl0vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIHN0cmluZ0RvdWJsZTogW1xuICAgICAgWy9bXlxcXFxcIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIHN0cmluZ1NpbmdsZTogW1xuICAgICAgWy9bXlxcXFwnXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5pbnZhbGlkXCJdLFxuICAgICAgWy8nLywgXCJzdHJpbmdcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBpZGVudGlmaWVyQmFja3RpY2s6IFtcbiAgICAgIFsvW15cXFxcYF0rLywgXCJpZGVudGlmaWVyLmVzY2FwZVwiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcImlkZW50aWZpZXIuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwiaWRlbnRpZmllci5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvYC8sIFwiaWRlbnRpZmllci5lc2NhcGVcIiwgXCJAcG9wXCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixjQUFjLENBQUMsTUFBTSxJQUFJO0FBQUEsRUFDMUI7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsWUFBWTtBQUFBLEVBQ1osVUFBVTtBQUFBLElBQ1IsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sa0JBQW1CO0FBQUEsSUFDbkQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sb0JBQXFCO0FBQUEsSUFDckQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sd0JBQXlCO0FBQUEsRUFDMUQ7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELGlCQUFpQixDQUFDLFFBQVEsUUFBUSxTQUFTLFNBQVMsUUFBUSxNQUFNO0FBQUEsRUFDbEUsa0JBQWtCO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsV0FBVztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxTQUFTO0FBQUEsRUFDVCxRQUFRO0FBQUEsRUFDUixhQUFhO0FBQUEsRUFDYixXQUFXO0FBQUEsRUFDWCxXQUFXO0FBQUEsSUFDVCxNQUFNLENBQUMsQ0FBQyxhQUFhLFdBQVcsR0FBRyxFQUFFLFNBQVMsVUFBVTtBQUFBLElBQ3hELFFBQVE7QUFBQSxNQUNOLEVBQUUsU0FBUyxjQUFlO0FBQUEsTUFDMUIsRUFBRSxTQUFTLFdBQVk7QUFBQSxNQUN2QixFQUFFLFNBQVMsV0FBWTtBQUFBLE1BQ3ZCLENBQUMsbUJBQW1CLGlCQUFpQjtBQUFBLE1BQ3JDO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxZQUNMLHFCQUFxQjtBQUFBLFVBQ3RCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNEO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxZQUNMLGFBQWE7QUFBQSxZQUNiLG9CQUFvQjtBQUFBLFlBQ3BCLFlBQVk7QUFBQSxVQUNiO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsS0FBSyxxQkFBcUIscUJBQXFCO0FBQUEsTUFDaEQsQ0FBQyxXQUFXLFdBQVc7QUFBQSxNQUN2QjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxjQUFjO0FBQUEsWUFDZCxZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxpQ0FBaUMsY0FBYztBQUFBLE1BQ2hELENBQUMsNkNBQTZDLGNBQWM7QUFBQSxNQUM1RCxDQUFDLG9CQUFvQixZQUFZO0FBQUEsTUFDakMsQ0FBQyxxQkFBcUIsY0FBYztBQUFBLE1BQ3BDLENBQUMsZUFBZSxRQUFRO0FBQUEsSUFDekI7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNQLENBQUMsbUJBQW1CLGdCQUFnQjtBQUFBLE1BQ3BDLENBQUMsbUJBQW1CLGdCQUFnQjtBQUFBLE1BQ3BDLENBQUMsS0FBSyxVQUFVLGVBQWU7QUFBQSxNQUMvQixDQUFDLEtBQUssVUFBVSxlQUFlO0FBQUEsSUFDaEM7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLENBQUMsY0FBYyxPQUFPO0FBQUEsTUFDdEIsQ0FBQyxRQUFRLFdBQVcsVUFBVTtBQUFBLE1BQzlCLENBQUMsV0FBVyxTQUFTO0FBQUEsSUFDdEI7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNQLENBQUMsVUFBVSxTQUFTO0FBQUEsTUFDcEIsQ0FBQyxVQUFVLFNBQVM7QUFBQSxNQUNwQixDQUFDLFFBQVEsV0FBVyxNQUFNO0FBQUEsTUFDMUIsQ0FBQyxRQUFRLFNBQVM7QUFBQSxJQUNuQjtBQUFBLElBQ0QsY0FBYztBQUFBLE1BQ1osQ0FBQyxXQUFXLFFBQVE7QUFBQSxNQUNwQixDQUFDLFlBQVksUUFBUTtBQUFBLE1BQ3JCLENBQUMsT0FBTyxnQkFBZ0I7QUFBQSxNQUN4QixDQUFDLEtBQUssVUFBVSxNQUFNO0FBQUEsSUFDdkI7QUFBQSxJQUNELGNBQWM7QUFBQSxNQUNaLENBQUMsV0FBVyxRQUFRO0FBQUEsTUFDcEIsQ0FBQyxZQUFZLFFBQVE7QUFBQSxNQUNyQixDQUFDLE9BQU8sZ0JBQWdCO0FBQUEsTUFDeEIsQ0FBQyxLQUFLLFVBQVUsTUFBTTtBQUFBLElBQ3ZCO0FBQUEsSUFDRCxvQkFBb0I7QUFBQSxNQUNsQixDQUFDLFdBQVcsbUJBQW1CO0FBQUEsTUFDL0IsQ0FBQyxZQUFZLG1CQUFtQjtBQUFBLE1BQ2hDLENBQUMsT0FBTywyQkFBMkI7QUFBQSxNQUNuQyxDQUFDLEtBQUsscUJBQXFCLE1BQU07QUFBQSxJQUNsQztBQUFBLEVBQ0Y7QUFDSDsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMF19
